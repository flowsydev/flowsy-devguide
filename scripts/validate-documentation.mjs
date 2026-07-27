import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const contentRoot = path.join(root, 'content')
const configPath = path.join(root, '.vitepress', 'config.ts')

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  }))
  return nested.flat()
}

function normalizeRoute(route) {
  const clean = route.replace(/\\/g, '/').replace(/\/index\.md$/, '/').replace(/\.md$/, '')
  return clean === '/index' ? '/' : clean
}

function routeForFile(file) {
  return normalizeRoute('/' + path.relative(contentRoot, file))
}

function stripFencedCode(markdown) {
  return markdown
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/^~~~[\s\S]*?^~~~/gm, '')
}

function stripCode(markdown) {
  return stripFencedCode(markdown)
    .replace(/`[^`\n]*`/g, '')
}

function frontmatterOf(markdown) {
  if (!markdown.startsWith('---\n')) return ''
  const end = markdown.indexOf('\n---', 4)
  return end === -1 ? '' : markdown.slice(4, end)
}

function isRedirect(markdown) {
  return /^type:\s*redirect\s*$/m.test(frontmatterOf(markdown))
}

function frontmatterValue(markdown, key) {
  const match = frontmatterOf(markdown).match(new RegExp('^' + key + ':\\s*([^\\n]+)\\s*$', 'm'))
  return match?.[1]?.replace(/^['"]|['"]$/g, '')
}

function extractLinks(markdown) {
  const links = []
  const visible = stripCode(markdown)
  for (const match of visible.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^)]*)?\)/g)) {
    if (!match[0].startsWith('!')) links.push(match[1])
  }
  for (const match of frontmatterOf(markdown).matchAll(/^\s*link:\s*['"]?([^'"\s]+)['"]?\s*$/gm)) {
    links.push(match[1])
  }
  return links
}

function slugify(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s+/g, '-')
}

function headingsOf(markdown) {
  const headings = new Set()
  for (const match of stripCode(markdown).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const simple = match[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
    headings.add(slugify(simple))
  }
  return headings
}

function resolveMarkdownTarget(sourceFile, href) {
  const decoded = decodeURI(href.replace(/^<|>$/g, ''))
  const [pathname, fragment = ''] = decoded.split('#', 2)
  if (!pathname) return { file: sourceFile, fragment }
  if (/^(?:[a-z]+:|\/\/)/i.test(pathname)) return null

  const withoutQuery = pathname.split('?')[0]
  if (withoutQuery.startsWith('/assets/')) {
    return { asset: path.join(contentRoot, 'public', withoutQuery.slice(1)), fragment }
  }

  const base = withoutQuery.startsWith('/')
    ? path.join(contentRoot, withoutQuery.slice(1))
    : path.resolve(path.dirname(sourceFile), withoutQuery)

  const candidates = path.extname(base)
    ? [base]
    : [base + '.md', path.join(base, 'index.md')]
  const file = candidates.find((candidate) => existsSync(candidate))
  return { file, fragment }
}

const allFiles = await walk(contentRoot)
const markdownFiles = allFiles.filter((file) => file.endsWith('.md'))
const documents = new Map()
const routeToFile = new Map()

for (const file of markdownFiles) {
  const markdown = await readFile(file, 'utf8')
  const route = routeForFile(file)
  documents.set(file, { markdown, route, redirect: isRedirect(markdown) })
  routeToFile.set(route, file)
  if (route.endsWith('/')) routeToFile.set(route.slice(0, -1), file)
}

const errors = []
const graph = new Map()

for (const [sourceFile, document] of documents) {
  const outgoing = new Set()
  const type = frontmatterValue(document.markdown, 'type')
  if (type) {
    const required = type === 'redirect'
      ? ['title', 'description', 'type', 'redirect', 'canonical']
      : ['title', 'description', 'type', 'audience', 'canonical']
    for (const field of required) {
      if (!frontmatterValue(document.markdown, field)) {
        errors.push(path.relative(root, sourceFile) + ': missing required frontmatter ' + field)
      }
    }
    if ((type === 'profile' || type === 'reference') && !frontmatterValue(document.markdown, 'canonicalSource')) {
      errors.push(path.relative(root, sourceFile) + ': missing required frontmatter canonicalSource')
    }
    if (type === 'redirect' && frontmatterValue(document.markdown, 'canonical') !== 'false') {
      errors.push(path.relative(root, sourceFile) + ': a bridge must declare canonical: false')
    }
  }

  const visibleLines = stripFencedCode(document.markdown).split('\n')
  for (let index = 1; index < visibleLines.length; index += 1) {
    const current = visibleLines[index].trim()
    const structural = /^(?:---|[|>#{}[\]();,]+)$/.test(current)
    if (current && !structural && current === visibleLines[index - 1].trim()) {
      errors.push(path.relative(root, sourceFile) + ':' + (index + 1) + ': duplicate consecutive line')
    }
  }

  for (const href of extractLinks(document.markdown)) {
    const target = resolveMarkdownTarget(sourceFile, href)
    if (!target) continue
    if (target.asset) {
      if (!existsSync(target.asset)) {
        errors.push(path.relative(root, sourceFile) + ': missing asset ' + href)
      }
      continue
    }
    if (!target.file) {
      errors.push(path.relative(root, sourceFile) + ': missing target ' + href)
      continue
    }
    const targetDocument = documents.get(target.file)
    if (targetDocument) {
      outgoing.add(targetDocument.route)
      if (target.fragment && !headingsOf(targetDocument.markdown).has(target.fragment.toLowerCase())) {
        errors.push(path.relative(root, sourceFile) + ': missing anchor ' + href)
      }
    }
  }
  graph.set(document.route, outgoing)
}

const config = await readFile(configPath, 'utf8')
const seeds = new Set(['/'])
for (const match of config.matchAll(/link:\s*['"](\/[^'"]*)['"]/g)) {
  const route = normalizeRoute(match[1])
  if (!routeToFile.has(route) && !routeToFile.has(route.replace(/\/$/, ''))) {
    errors.push('.vitepress/config.ts: missing navigation route ' + match[1])
  } else {
    seeds.add(route)
  }
}

const reachable = new Set()
const queue = [...seeds]
while (queue.length) {
  const route = queue.shift()
  const normalized = routeToFile.has(route)
    ? route
    : route.endsWith('/') ? route.slice(0, -1) : route + '/'
  const file = routeToFile.get(normalized)
  if (!file) continue
  const canonicalRoute = documents.get(file).route
  if (reachable.has(canonicalRoute)) continue
  reachable.add(canonicalRoute)
  for (const target of graph.get(canonicalRoute) ?? []) queue.push(target)
}

for (const [file, document] of documents) {
  if (!document.redirect && !reachable.has(document.route)) {
    errors.push(path.relative(root, file) + ': public page not reachable from navigation')
  }
}

if (errors.length) {
  console.error('Documentation validation failed with ' + errors.length + ' problem(s):')
  for (const error of errors) console.error('- ' + error)
  process.exit(1)
}

console.log('Documentation validation passed: ' + markdownFiles.length + ' pages; internal links and navigation coverage verified.')
