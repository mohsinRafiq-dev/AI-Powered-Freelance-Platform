// Babel plugin to transform import.meta.env to global.__VITE_IMPORT_META_ENV__ for Jest
module.exports = function({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        const node = path.node;
        
        // Transform import.meta.env.X to global.__VITE_IMPORT_META_ENV__.X
        // Pattern: import.meta.env.VITE_API_URL
        if (
          t.isMemberExpression(node.object) &&
          t.isMetaProperty(node.object.object) &&
          node.object.object.meta &&
          node.object.object.meta.name === 'import' &&
          t.isIdentifier(node.object.property) &&
          node.object.property.name === 'env'
        ) {
          // Get property name (VITE_API_URL, DEV, MODE, etc.)
          let propertyName = null;
          if (t.isIdentifier(node.property)) {
            propertyName = node.property.name;
          } else if (t.isStringLiteral(node.property)) {
            propertyName = node.property.value;
          }
          
          if (propertyName) {
            // Replace with: global.__VITE_IMPORT_META_ENV__[propertyName]
            path.replaceWith(
              t.memberExpression(
                t.memberExpression(
                  t.identifier('global'),
                  t.identifier('__VITE_IMPORT_META_ENV__')
                ),
                t.identifier(String(propertyName))
              )
            );
          }
        }
      }
    }
  };
};

