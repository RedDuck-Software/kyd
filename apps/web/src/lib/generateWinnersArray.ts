export const generateWinnerImagesArray = (topDonateWinners: { amount: string; winnerNFT: { image: File } }[]) => {
  const result: File[] = [];
  topDonateWinners.forEach(({ amount, winnerNFT }) => {
    const length = parseInt(amount);
    for (let i = 0; i < length; i++) {
      result.push(winnerNFT.image);
    }
  });
  return result;
};
