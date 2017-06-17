var pjax = require('jquery-pjax');
// console.log(pjax);
var tree = [
  {
    text: "首页",
    href: '/admin',
  },
  {
    text: "文章",
    nodes: [
      {
        text: "查看",
        href: "/admin/articles"
      },
      {
        text: "新增",
        href: "/admin/article",
      }
    ]
  },
  {
    text: "Child 2"
  },
  {
    text: "Parent 2"
  },
  {
    text: "Parent 3"
  },
  {
    text: "Parent 4"
  },
  {
    text: "Parent 5"
  }
];
$('#menu-tree').treeview({
  data:tree,
  backColor:'#008151',
  showBorder:false,
  onhoverColor:'#016b43',
  selectedBackColor:'#016b43',
  onNodeSelected: function(event, data) {
    // event.preventDefault();
    $.pjax({url:data.href, container: '#content'})
  },
  enableLinks:false,
})
