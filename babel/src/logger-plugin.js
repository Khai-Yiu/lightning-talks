function loggerPlugin({ types }) {
    return {
        visitor: {
            CallExpression(path) {
                if (
                    types.isMemberExpression(path.node.callee) &&
                    path.node.callee.object.name === 'console' &&
                    path.node.callee.property.name === 'log'
                ) {
                    const newCallee = types.identifier('myLogger');
                    const newCallExpression = types.callExpression(
                        newCallee,
                        path.node.arguments,
                    );
                    path.replaceWith(newCallExpression);
                }
            },
        },
    };
}

export default loggerPlugin;
