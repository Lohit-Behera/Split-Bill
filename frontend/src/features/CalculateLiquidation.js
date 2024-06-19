function calculateLiquidation(group, payment, payer) {

  // Check for invalid inputs
  if (!Array.isArray(group) || !Array.isArray(payment) || !Array.isArray(payer)) {
    throw new Error("Invalid input: all arguments must be arrays");
  }
  if (group.length === 0 || payment.length === 0 || payer.length === 0) {
    throw new Error("Invalid input: arrays must not be empty");
  }
  if (payment.length !== payer.length) {
    throw new Error("Invalid input: payment and payer arrays must have the same length");
  }

  const numMembers = group.length;
  const totalPayment = payment.reduce((a, b) => a + b, 0);
  const sharePerMember = totalPayment / numMembers;

  let balances = {};
  group.forEach((member) => (balances[member] = -sharePerMember));

  for (let i = 0; i < payment.length; i++) {
    if (balances[payer[i]] === undefined) {
      throw new Error(`Payer ${payer[i]} is not in the group`);
    }
    balances[payer[i]] += payment[i];
  }

  let creditors = {};
  let debtors = {};

  for (let member in balances) {
    if (balances[member] > 0) {
      creditors[member] = balances[member];
    } else if (balances[member] < 0) {
      debtors[member] = -balances[member];
    }
  }

  let debtorMember = [];
  let creditorMember = [];
  let totalAmount = [];

  for (let debtor in debtors) {
    let debt = debtors[debtor];
    creditors = Object.fromEntries(
      Object.entries(creditors).sort((a, b) => b[1] - a[1])
    );

    while (debt > 0 && Object.keys(creditors).length > 0) {
      let [creditor, credit] = Object.entries(creditors)[0];
      if (credit > debt) {
        debtorMember.push(debtor);
        creditorMember.push(creditor);
        totalAmount.push(Math.round(debt));
        creditors[creditor] -= debt;
        if (creditors[creditor] === 0) {
          delete creditors[creditor];
        }
        debt = 0;
      } else {
        debtorMember.push(debtor);
        creditorMember.push(creditor);
        totalAmount.push(Math.round(credit));
        debt -= credit;
        delete creditors[creditor];
      }
    }
  }

  return {
    debtorMember: debtorMember,
    creditorMember: creditorMember,
    totalAmount: totalAmount,
  };
}

export default calculateLiquidation;
