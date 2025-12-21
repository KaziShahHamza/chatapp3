const attachMyVote = (doc, userId) => {
  const vote = doc.votes.find(v => v.user.toString() === userId);
  doc.myVote = vote ? vote.value : 0;
};

export default attachMyVote;
