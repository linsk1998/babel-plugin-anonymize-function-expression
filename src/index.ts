import type { NodePath, types as t } from '@babel/core';

export = function() {
	return {
		visitor: {
			FunctionExpression(path: NodePath<t.FunctionExpression>) {
				if(path.node.id) {
					const binding = path.scope.getBinding(path.node.id.name);
					if(binding && binding.referenced) {
						return;
					}
					// 移除函数表达式名称
					path.node.id = null;
				}
			}
		}
	};
};
