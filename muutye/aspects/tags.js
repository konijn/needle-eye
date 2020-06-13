/*jshint esversion: 6, node: true */

module.exports = {

  //Search for a given tag that is in a subnode, ensure there is only one
  getUniqueTag: function getUniqueTag(node, tag) {
    const nodeList = node.getElementsByTagName(tag);
    if (nodeList.length === 0) {
      log(CATASTROPHE, `Found no ${tag} tag`);
    } else if (nodeList.length > 1) {
      log(WARNING, `Got ${nodeList.length-1} too many ${tag} tags in ${node.tagName}`);
    }
    return nodeList[0];
  },

  //Search for a given tag, report whether it was found or not
  hasTag: function hasTag(node, tag) {
    return !!node.getElementsByTagName(tag).length;
  },

  //Search for a given tag, report whether it was found or not
  getTags: function getTags(node, tag) {
    return Array.from(node.getElementsByTagName(tag));
  },

  //nodes are not arrays, so we cant use Array.prototype.filter
	filterNodes: function filterNodes(nodes, filter){
		const out = [];
		for(let i = 0; i < nodes.length; i++){
			if(filter(nodes[i]))
				out.push(nodes[i]);
		}
		return out;
	}
};
