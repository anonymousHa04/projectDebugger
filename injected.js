(function () {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (window.__DEV__) {
        console.log(hook);
    }
    if (!hook) return;

    hook.onCommitFiberRoot = function (id, root) {
        const fiberTree = traverseFiber(root.current);
        const origin =
            location.hostname === "localhost"
                ? `${location.protocol}//${location.hostname}:${location.port}`
                : "*";
        window.postMessage({ type: "FIBER_DATA", fiberTree }, origin);
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