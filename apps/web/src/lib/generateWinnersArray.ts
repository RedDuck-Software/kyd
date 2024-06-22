export const generateWinnerArray = (
  topDonateWinners: { amount: string; winnerNFT: { name: string; image: File } }[]
) => {
  const result: { name: string; file: File }[] = [];
  topDonateWinners.forEach(({ amount, winnerNFT }) => {
    const length = parseInt(amount);
    for (let i = 0; i < length; i++) {
      result.push({ name: winnerNFT.name, file: winnerNFT.image });
    }
  });
  return result;
};
