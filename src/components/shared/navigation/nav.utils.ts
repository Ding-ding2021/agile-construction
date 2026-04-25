const routePrefixMatchers: Record<string, string[]> = {
  '#/projects': ['#/projects', '#/projects/'],
  '#/tasks': ['#/tasks', '#/tasks?', '#/tasks/'],
  '#/personnel': ['#/personnel'],
  '#/customers': ['#/customers', '#/customers/'],
  '#/settings': ['#/settings'],
  '#/standards': ['#/standards', '#/standards/'],
  '#/digital-employee': ['#/digital-employee', '#/digital-employee/'],
  '#/procurement': ['#/procurement', '#/procurement/'],
  '#/contracts': ['#/contracts', '#/contracts/'],
  '#/orders': ['#/orders', '#/orders/'],
  '#/facility': ['#/facility', '#/facility/'],
  '#/resources': ['#/resources', '#/resources/'],
}

export const navigateByHash = (targetHash: string) => {
  if (!targetHash.startsWith('#/')) {
    return
  }

  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash
    return
  }

  const baseUrl = `${window.location.pathname}${window.location.search}`
  window.location.assign(`${baseUrl}${targetHash}`)
}

export const isHashRouteActive = (currentHash: string, href?: string) => {
  if (!href) {
    return false
  }

  const matchers = routePrefixMatchers[href] ?? [href]
  return matchers.some(matcher => currentHash === matcher || currentHash.startsWith(matcher))
}
