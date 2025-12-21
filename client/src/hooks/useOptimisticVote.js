export function optimisticVote(entity, value, userId) {
  const prevVote = entity.myVote || 0;

  let likeCount = entity.likeCount;
  let dislikeCount = entity.dislikeCount;
  let myVote = prevVote;

  // toggle off
  if (prevVote === value) {
    myVote = 0;
    if (value === 1) likeCount--;
    else dislikeCount--;
  }
  // switch
  else if (prevVote !== 0) {
    myVote = value;
    if (value === 1) {
      likeCount++;
      dislikeCount--;
    } else {
      dislikeCount++;
      likeCount--;
    }
  }
  // new vote
  else {
    myVote = value;
    if (value === 1) likeCount++;
    else dislikeCount++;
  }

  return {
    ...entity,
    likeCount,
    dislikeCount,
    myVote,
  };
}
