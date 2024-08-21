module.exports = function loggerPlugin({ types }) {
    return {
        visitor: {
            CallExpression(path) {
                const { node } = path;
                if (
                    types.isMemberExpression(node.callee) &&
                    node.callee.object.name === 'console' &&
                    node.callee.property.name === 'log'
                ) {
                    const newCallee = types.identifier('customLogger');
                    const newCallExpression = types.CallExpression(
                        newCallee,
                        node.arguments,
                    );
                    path.replaceWith(newCallExpression);
                }
            },
        },
    };
};
