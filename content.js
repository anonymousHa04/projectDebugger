(function () {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

//   console.log(hook)
  if (!hook) {
    console.warn("React DevTools not found.");
    return;
  }

  hook.onCommitFiberRoot = function (id, root, priorityLevel) {
    const current = root.current;

    const fiberTree = traverseFiber(current);
    window.postMessage({ type: "REACT_FIBER_TREE", fiberTree }, "*");
  };

  function traverseFiber(fiber) {
    if (!fiber) return null;

    const data = {
      type: fiber.type?.name || fiber.type,
      key: fiber.key,
      props: fiber.memoizedProps,
      state: fiber.memoizedState,
      children: []
    };

    let child = fiber.child;
    while (child) {
      data.children.push(traverseFiber(child));
      child = child.sibling;
    }

    return data;
  }
})();
