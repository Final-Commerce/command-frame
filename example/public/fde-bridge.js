/**
 * FDE Debug Bridge v1.0.0
 * Standalone script — add to your extension for full FDE inspection support.
 *
 * Usage:
 *   <script src="fde-bridge.js"></script>
 *
 * Or install via npm:
 *   npm install --save-dev @final-commerce/fde-bridge
 *   import '@final-commerce/fde-bridge';
 */
(function () {
  if (!window.parent || window.parent === window) return;

  var FDE_PREFIX = 'fde-';
  var BRIDGE_VERSION = '1.0.0';

  function getFiberFromElement(element) {
    var keys = Object.keys(element);
    var fiberKey = keys.find(function (k) {
      return k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$');
    });
    return fiberKey ? element[fiberKey] : null;
  }

  function getReactRoot() {
    var rootEl = document.getElementById('root') || document.querySelector('[data-reactroot]');
    if (!rootEl) return null;
    var fiber = getFiberFromElement(rootEl);
    if (fiber) {
      var current = fiber;
      while (current.return) current = current.return;
      return current;
    }
    if (rootEl._reactRootContainer) {
      return rootEl._reactRootContainer._internalRoot
        ? rootEl._reactRootContainer._internalRoot.current
        : null;
    }
    return null;
  }

  function getDisplayName(fiber) {
    if (!fiber || !fiber.type) return '#text';
    if (typeof fiber.type === 'string') return fiber.type;
    if (fiber.type.displayName) return fiber.type.displayName;
    if (fiber.type.name) return fiber.type.name;
    if (fiber.type.$$typeof) {
      var inner = fiber.type.render || fiber.type.type;
      if (inner && inner.displayName) return inner.displayName;
      if (inner && inner.name) return inner.name;
    }
    return 'Anonymous';
  }

  function isUserComponent(fiber) {
    return fiber && typeof fiber.type === 'function';
  }

  function serializeProps(props, depth) {
    depth = depth || 0;
    if (depth > 3) return '[nested]';
    if (props === null || props === undefined) return props;
    if (typeof props !== 'object') return props;
    if (Array.isArray(props)) {
      if (props.length > 20) {
        return props
          .slice(0, 20)
          .map(function (v) {
            return serializeProps(v, depth + 1);
          })
          .concat(['...' + (props.length - 20) + ' more']);
      }
      return props.map(function (v) {
        return serializeProps(v, depth + 1);
      });
    }
    var result = {};
    var keys = Object.keys(props);
    var slice = keys.slice(0, 50);
    for (var i = 0; i < slice.length; i++) {
      var key = slice[i];
      if (key === 'children') {
        result[key] = typeof props[key] === 'string' ? props[key] : '[React children]';
      } else if (typeof props[key] === 'function') {
        result[key] = '[Function: ' + (props[key].name || 'anonymous') + ']';
      } else if (props[key] instanceof HTMLElement) {
        result[key] = '[HTMLElement: ' + props[key].tagName + ']';
      } else {
        result[key] = serializeProps(props[key], depth + 1);
      }
    }
    if (keys.length > 50) result['...'] = keys.length - 50 + ' more keys';
    return result;
  }

  function extractHooksState(fiber) {
    var hooks = [];
    var hook = fiber.memoizedState;
    var index = 0;
    while (hook) {
      if (hook.queue) {
        hooks.push({ index: index, type: 'state', value: serializeProps(hook.memoizedState, 0) });
      } else if (hook.memoizedState && typeof hook.memoizedState === 'object' && 'current' in hook.memoizedState) {
        hooks.push({ index: index, type: 'ref', value: serializeProps(hook.memoizedState.current, 0) });
      } else if (Array.isArray(hook.memoizedState) && hook.memoizedState.length === 2) {
        hooks.push({ index: index, type: 'memo', value: serializeProps(hook.memoizedState[0], 0) });
      }
      hook = hook.next;
      index++;
      if (index > 100) break;
    }
    return hooks;
  }

  function buildComponentNode(fiber, depth) {
    depth = depth || 0;
    if (!fiber || depth > 30) return null;
    var node = {
      name: getDisplayName(fiber),
      isUserComponent: isUserComponent(fiber),
      props: isUserComponent(fiber) ? serializeProps(fiber.memoizedProps) : undefined,
      hooks: isUserComponent(fiber) ? extractHooksState(fiber) : undefined,
      children: [],
    };
    var child = fiber.child;
    while (child) {
      var isDOMElement = typeof child.type === 'string';
      var isComp = isUserComponent(child);
      if (isComp) {
        var childNode = buildComponentNode(child, depth + 1);
        if (childNode) node.children.push(childNode);
      } else if (isDOMElement) {
        var childNode2 = buildComponentNode(child, depth + 1);
        if (childNode2 && (childNode2.children.length > 0 || childNode2.isUserComponent)) {
          node.children.push(childNode2);
        }
      } else {
        var innerChild = child.child;
        while (innerChild) {
          var childNode3 = buildComponentNode(innerChild, depth + 1);
          if (childNode3) node.children.push(childNode3);
          innerChild = innerChild.sibling;
        }
      }
      child = child.sibling;
    }
    return node;
  }

  function getComponentStackAtPoint(x, y) {
    var element = document.elementFromPoint(x, y);
    if (!element) return { error: 'No element at coordinates' };
    var fiber = getFiberFromElement(element);
    if (!fiber)
      return {
        error: 'No React fiber found',
        domElement: {
          tag: element.tagName.toLowerCase(),
          id: element.id || undefined,
          className: element.className || undefined,
          textContent: (element.textContent || '').slice(0, 200),
        },
      };
    var stack = [];
    var current = fiber;
    while (current) {
      if (isUserComponent(current)) {
        stack.push({
          name: getDisplayName(current),
          props: serializeProps(current.memoizedProps),
          hooks: extractHooksState(current),
        });
      }
      current = current.return;
    }
    var textContent = (element.textContent || '').trim().slice(0, 500);
    var rect = element.getBoundingClientRect();
    return {
      element: {
        tag: element.tagName.toLowerCase(),
        id: element.id || undefined,
        className: element.className || undefined,
        textContent: textContent,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      },
      componentStack: stack,
      nearestComponent: stack[0] || null,
    };
  }

  var highlightOverlay = null;
  var highlightLabel = null;

  function createHighlightOverlay() {
    if (highlightOverlay) return;
    highlightOverlay = document.createElement('div');
    highlightOverlay.id = 'fde-highlight-overlay';
    highlightOverlay.style.cssText =
      'position:fixed;pointer-events:none;z-index:999999;border:2px solid #6366f1;background:rgba(99,102,241,0.1);border-radius:2px;transition:all 0.1s ease;display:none;';
    document.body.appendChild(highlightOverlay);
    highlightLabel = document.createElement('div');
    highlightLabel.id = 'fde-highlight-label';
    highlightLabel.style.cssText =
      'position:fixed;pointer-events:none;z-index:999999;background:#6366f1;color:white;padding:2px 6px;border-radius:2px;font-size:11px;font-family:monospace;white-space:nowrap;display:none;';
    document.body.appendChild(highlightLabel);
  }

  function highlightElement(selector) {
    createHighlightOverlay();
    var element = document.querySelector(selector);
    if (!element || !highlightOverlay || !highlightLabel) {
      hideHighlight();
      return;
    }
    var rect = element.getBoundingClientRect();
    highlightOverlay.style.left = rect.left + 'px';
    highlightOverlay.style.top = rect.top + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
    highlightOverlay.style.display = 'block';
    var fiber = getFiberFromElement(element);
    var componentName = element.tagName.toLowerCase();
    if (fiber) {
      var current = fiber;
      while (current) {
        if (isUserComponent(current)) {
          componentName = getDisplayName(current);
          break;
        }
        current = current.return;
      }
    }
    highlightLabel.textContent = componentName;
    highlightLabel.style.left = rect.left + 'px';
    highlightLabel.style.top = rect.top - 20 + 'px';
    highlightLabel.style.display = 'block';
  }

  function hideHighlight() {
    if (highlightOverlay) highlightOverlay.style.display = 'none';
    if (highlightLabel) highlightLabel.style.display = 'none';
  }

  function searchValueInDOM(searchValue) {
    var results = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode()) && results.length < 50) {
      var text = (node.textContent || '').trim();
      if (!text) continue;
      if (text.includes(searchValue) || text === searchValue) {
        var parentElement = node.parentElement;
        if (!parentElement) continue;
        var fiber = getFiberFromElement(parentElement);
        var componentName = parentElement.tagName.toLowerCase();
        var componentProps;
        if (fiber) {
          var current = fiber;
          while (current) {
            if (isUserComponent(current)) {
              componentName = getDisplayName(current);
              componentProps = serializeProps(current.memoizedProps);
              break;
            }
            current = current.return;
          }
        }
        results.push({
          text: text.slice(0, 200),
          element: {
            tag: parentElement.tagName.toLowerCase(),
            id: parentElement.id || undefined,
            className: parentElement.className || undefined,
          },
          component: componentName,
          componentProps: componentProps,
          rect: parentElement.getBoundingClientRect(),
        });
      }
    }
    return results;
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || typeof data !== 'object') return;
    if (typeof data.type !== 'string' || !data.type.startsWith(FDE_PREFIX)) return;
    var messageType = data.type;
    var replyId = data.replyId;
    function reply(payload) {
      window.parent.postMessage({ type: messageType + '-response', replyId: replyId, payload: payload }, '*');
    }
    switch (messageType) {
      case 'fde-ping':
        reply({ version: BRIDGE_VERSION, react: !!getReactRoot() });
        break;
      case 'fde-get-tree':
        var root = getReactRoot();
        if (!root) {
          reply({ error: 'No React root found' });
        } else {
          reply({ tree: buildComponentNode(root) });
        }
        break;
      case 'fde-inspect-at':
        reply(getComponentStackAtPoint(data.x, data.y));
        break;
      case 'fde-highlight':
        if (data.selector) {
          highlightElement(data.selector);
        } else {
          hideHighlight();
        }
        reply({ ok: true });
        break;
      case 'fde-search-value':
        reply({ matches: searchValueInDOM(String(data.value)) });
        break;
      case 'fde-get-element-info':
        var el = data.selector ? document.querySelector(data.selector) : null;
        if (!el) {
          reply({ error: 'Element not found' });
        } else {
          var f = getFiberFromElement(el);
          reply({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').slice(0, 500),
            fiber: f ? { name: getDisplayName(f), props: serializeProps(f.memoizedProps) } : null,
          });
        }
        break;
    }
  });

  window.parent.postMessage({ type: 'fde-bridge-ready', payload: { version: BRIDGE_VERSION } }, '*');
})();
