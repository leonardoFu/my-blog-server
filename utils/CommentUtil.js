const CommentUtil = {
  generateReference: function (comments){
    comments.forEach((comment) => {
      if(comment.reference_id){
        comment.reference = findById(comments, comment.reference_id);
      }
    })
    return comments;
  }
}

function findById(arr, id){
  let result = arr.filter(v => v.id === id)
  return result.length ? result[0] : {};
}

module.exports = CommentUtil;
