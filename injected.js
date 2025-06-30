(function () {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (process.env.NODE_ENV === "development") {
    console.log(hook);
  }
  if (!hook) return;

  hook.onCommitFiberRoot = function (id, root) {
    const fiberTree = traverseFiber(root.current);
    const origin =
      location.hostname === "localhost"
        ? `${location.protocol}//${location.hostname}:${location.port}`
        : "*";
    window.postMessage({ type: "REACT_FIBER_TREE", fiberTree }, origin);
  };

  /**
   * Recursively serializes a React fiber node and its subtree into a plain object.
   * @param {Object} fiber - The React fiber node to traverse.
   * @return {Object|null} An object representing the fiber node and its children, or null if the input is falsy.
   */
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