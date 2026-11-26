import type { LessonText, ModuleText, QuizText } from './types';

/** Textes anglais du parcours d'apprentissage (indexés par id, voir data/gameContent.ts). */
export const MODULES_EN: Record<string, ModuleText> = {
  m1: { title: 'Survival & Cash', subtitle: 'Protect your cash, the basis of everything' },
  m2: { title: 'Prices & Margins', subtitle: 'Sell at the right price, without losing' },
  m3: { title: 'Customers & Credit', subtitle: 'Build loyalty without getting drained' },
  m4: { title: 'Growth & Team', subtitle: 'Go from trader to boss' },
};

export const LESSONS_EN: Record<string, LessonText> = {
  m1l1: {
    title: 'Personal cash ≠ business cash',
    description: 'Stop mixing your money with the shop’s money.',
    theory: [
      ['Two pockets, two roles', 'Business cash is for restocking and paying costs. Your personal pocket is for your life. Mixing them means you no longer know whether you are making money.'],
      ['Pay yourself a salary', 'Set an amount every week or month and record it as “salary”. Everything else belongs to the shop.'],
      ['Every withdrawal is recorded', 'Even 1,000 FC taken for transport must be written down. What is not recorded disappears from your calculations.'],
    ],
  },
  m1l2: {
    title: 'The cash book',
    description: 'Record money in and out in 5 minutes a day.',
    theory: [
      ['Money in and money out', 'Every day: date, reason, amount in or out. A simple notebook or the KaziBoss “Cash book” tool is enough.'],
      ['The till must balance', 'In the evening: morning balance + money in – money out = real cash in the till. If there is a gap, look for it right away.'],
      ['Leaks become visible', 'After a week, you see where the money goes: transport, phone credit, small expenses. You can only cut what you measure.'],
    ],
  },
  m1l3: {
    title: 'The safety cushion',
    description: 'Working capital and a reserve for hard times.',
    theory: [
      ['Working capital', 'The money you need to restock and pay your costs while waiting for sales. Without it, the shop stops.'],
      ['The safety reserve', 'Aim to set aside at least one month of fixed costs (rent, electricity, salary), ideally in a separate account.'],
      ['In a stable currency', 'If your local currency loses value, keep your reserve in dollars or in something that protects its value.'],
    ],
  },
  m2l1: {
    title: 'The real cost price',
    description: 'What a product really costs you before you sell it.',
    theory: [
      ['The purchase price is not enough', 'Cost price = purchase price + transport + handling + losses + a share of fixed costs.'],
      ['Transport counts', 'A $5 trip to bring back 50 items adds $0.10 per item. On a small product, that is huge.'],
      ['So do losses', 'Breakage, expired goods, theft: if you lose 5% of your stock, your real cost goes up by 5%.'],
    ],
  },
  m2l2: {
    title: 'Margin or markup?',
    description: 'The “I just add 20%” trap.',
    theory: [
      ['Markup', 'The % added to the cost. Cost $10 + 25% = price $12.50.'],
      ['Margin', 'The % of the selling price you keep. On $12.50, you keep $2.50: that is a 20% margin, not 25%.'],
      ['Work from the margin', 'For a 20% margin: price = cost ÷ (1 – 0.20). The KaziBoss calculator does it for you.'],
    ],
  },
  m2l3: {
    title: 'Prices and exchange rates',
    description: 'Protect your margin when the currency moves.',
    theory: [
      ['Buy in USD, sell in local currency', 'If you buy in dollars and sell in francs, your cost changes every time the rate changes.'],
      ['Depreciation', 'If the franc goes from 2,800 to 2,950 FC per $1, you must raise your prices by about 5% to keep the same margin.'],
      ['Display a reference price', 'Many traders set a price in $ and display it in FC at the daily rate. It is transparent and protects your margin.'],
    ],
  },
  m3l1: {
    title: 'Safe customer credit',
    description: 'The 4 rules of a well-managed tab.',
    theory: [
      ['Written and signed', 'Name, amount, date, repayment date, signature. No writing, no debt.'],
      ['A limit per customer', 'Set a maximum (e.g. $10) and a total maximum for all customers (e.g. 20% of your stock).'],
      ['Chase early', 'A debt older than 30 days becomes hard to recover. Follow up politely from the first late payment.'],
    ],
  },
  m3l2: {
    title: 'Loyalty without discounts',
    description: 'Keep your customers without slashing prices.',
    theory: [
      ['Service before price', 'A warm welcome, cleanliness, availability, advice: reasons to come back that competitors cannot easily copy.'],
      ['The loyalty card', '“10 purchases = 1 free product”: the gift costs your purchase price, not your selling price.'],
      ['Word of mouth', 'A happy customer brings others. Reward referrals rather than lowering prices for everyone.'],
    ],
  },
  m3l3: {
    title: 'Mobile Money & payments',
    description: 'Take more payments, without scams.',
    theory: [
      ['Accept mobile payments', 'M-Pesa, Orange Money, Airtel Money, Wave: accepting mobile payment means no more lost sales for lack of cash.'],
      ['The fake SMS', 'Never trust an SMS shown by the customer: always check your real balance before handing over the goods.'],
      ['A business account', 'Use a number reserved for the shop. Your takings are tracked and kept apart from your personal money.'],
    ],
  },
  m4l1: {
    title: 'Hiring and paying',
    description: 'Your first employee, without conflict.',
    theory: [
      ['Written rules', 'Hours, tasks, salary, payday: even for a family member, putting it in writing avoids misunderstandings.'],
      ['Fixed + bonus', 'A modest fixed salary and a bonus linked to sales motivate without endangering your cash.'],
      ['Supportive checks', 'Counting the till together, a weekly stocktake: checks also protect the honest employee.'],
    ],
  },
  m4l2: {
    title: 'Borrowing wisely',
    description: 'Microcredit, savings circles, supplier credit.',
    theory: [
      ['The real cost of credit', '4% a month is nearly 48% a year. Your investment must earn more than that.'],
      ['A specific purpose', 'Borrow for fast-moving stock or equipment that cuts your costs, never for consumption.'],
      ['The alternatives', 'Supplier credit (often free) and savings circles (likelemba, tontine, susu) are interest-free financing to use first.'],
    ],
  },
  m4l3: {
    title: 'Opening a 2nd outlet',
    description: 'Grow without losing control.',
    theory: [
      ['The 1st must run on its own', 'Before opening a 2nd outlet, your 1st shop must be profitable and run without you for several days.'],
      ['The right location', 'Count the foot traffic, watch the competition, test with a table or kiosk before committing to rent.'],
      ['Managing from a distance', 'Daily cash book, weekly stocktake, mobile payments: these are your eyes when you are not there.'],
    ],
  },
};

export const QUIZ_EN: Record<string, QuizText> = {
  q01: {
    question: 'Your son needs $10 for medicine. What do you do first?',
    options: ['I take it from the till without recording anything', 'I take it from my salary, or record an exceptional withdrawal', 'I borrow from the supplier'],
    explanation: 'A recorded withdrawal stays under control. The problem is not using the money, it is not tracking it.',
  },
  q02: {
    question: '“If my till is full in the evening, I am making money.”',
    options: ['True', 'False'],
    explanation: 'False: the till may hold money owed to the supplier, customer deposits or your capital. Only calculating your profit tells the truth.',
  },
  q03: {
    question: 'What is the best way to pay yourself?',
    options: ['Take what I need each day', 'A fixed salary the shop can afford', 'Whatever is left at the end of the week'],
    explanation: 'A fixed, realistic salary makes your spending predictable and protects the shop’s capital.',
  },
  q37: {
    question: 'A customer has just paid you $20. Tonight you need to pay $15 for a household expense. What do you do?',
    options: ['I take the $15 from the takings without recording anything', 'I pay with my salary, or record a withdrawal against my salary', 'I postpone the household expense'],
    explanation: 'The takings belong to the shop. If you must dip into them, record it as an advance on your salary: your till stays balanced.',
  },
  q38: {
    question: 'Your salary is $50 a month. You have already withdrawn $15 three times this month. How much can you still pay yourself?',
    options: ['$5', '$15', '$35', '$0'],
    explanation: '3 × 15 = $45 already taken, so 50 – 45 = $5. Beyond that, you are no longer paying yourself: you are taking from the shop’s capital.',
  },
  q04: {
    question: 'Morning: $40 in the till. Sales: $35. Purchases: $20. How much should you have in the evening?',
    options: ['$55', '$75', '$60', '$45'],
    explanation: '40 + 35 – 20 = $55. If you count a different amount, something was not recorded or change was given wrongly.',
  },
  q05: {
    question: 'In the evening, $3 is missing from your till. What do you do?',
    options: ['I ignore it, it is small', 'I look for the mistake and record the difference', 'I add $3 from my pocket without saying anything'],
    explanation: 'Small repeated gaps become big losses. Recording them shows whether they repeat (mistake, theft, oversight).',
  },
  q06: {
    question: '“A cash book is only useful for big businesses.”',
    options: ['True', 'False'],
    explanation: 'False: the smaller your business, the more every dollar counts. The cash book is the boss’s first tool.',
  },
  q39: {
    question: 'Week: sales $120, stock purchases $70, small expenses $15. What is the balance for the week?',
    options: ['$50', '$35', '$85', '$205'],
    explanation: '120 – 70 – 15 = $35. Small expenses (transport, phone credit) count as much as purchases.',
  },
  q40: {
    question: 'When should you record a sale in the cash book?',
    options: ['At the end of the month', 'Right away, or that same evening at the latest', 'Only for big sales'],
    explanation: 'Memory forgets fast. Recording on the same day keeps the book reliable, and small sales make up most of your turnover.',
  },
  q07: {
    question: 'Rent $30, electricity $10, your salary $60 a month. What minimum reserve should you aim for?',
    options: ['$40', '$100', '$60', '$200'],
    explanation: '30 + 10 + 60 = $100: one month of fixed costs to get through a hard time.',
  },
  q08: {
    question: 'A big supplier discount requires 90% of your cash. What do you do?',
    options: ['I jump at the chance', 'I buy part of it and keep my reserve', 'I always refuse discounts'],
    explanation: 'A discount must never empty your reserve. Buy the quantity your cash can handle.',
  },
  q09: {
    question: 'Where is the best place to keep your safety reserve?',
    options: ['Under the mattress', 'In the shop’s till', 'In a separate account (savings co-op, bank, Mobile Money savings)'],
    explanation: 'Kept apart from the till, the reserve is protected from theft, temptation and everyday requests.',
  },
  q41: {
    question: '“My safety reserve can be used to buy stock on special offer.”',
    options: ['True', 'False'],
    explanation: 'False: the reserve is for hard times (illness, theft, power cuts, seizure). A special offer is financed with working capital, not with the safety cushion.',
  },
  q10: {
    question: 'You buy 100 bars of soap for $40 and pay $10 for transport. What is the cost price of one bar?',
    options: ['$0.40', '$0.50', '$0.10', '$0.45'],
    explanation: '(40 + 10) ÷ 100 = $0.50 per bar. Your selling price must start from this figure, not from $0.40.',
  },
  q11: {
    question: '“Rent is not part of the cost of my products.”',
    options: ['True', 'False'],
    explanation: 'False: fixed costs (rent, electricity) must be covered by the margin on all your products.',
  },
  q12: {
    question: 'Which item is most often forgotten in the cost price?',
    options: ['The purchase price', 'Transport and losses', 'The competitor’s price'],
    explanation: 'Transport and losses are invisible day to day, but they eat into the margin.',
  },
  q42: {
    question: 'A box of 24 bottles costs $12, plus $1.20 for transport. What is the cost price of one bottle?',
    options: ['$0.50', '$0.55', '$0.60', '$0.05'],
    explanation: '(12 + 1.20) ÷ 24 = $0.55. If you set your price from $0.50, you lose $0.05 of margin on every bottle.',
  },
  q43: {
    question: 'On every tray of 30 eggs, 2 arrive broken. What do you do with this loss?',
    options: ['I ignore it, it is small', 'I include it in my cost price', 'I deduct it from the delivery man’s pay'],
    explanation: 'If you pay for 30 eggs and only sell 28, your real cost per egg is the tray price divided by 28, not 30.',
  },
  q13: {
    question: 'Cost $8. You want a 20% margin on the selling price. What price?',
    options: ['$9.60', '$10', '$8.20', '$12'],
    explanation: '8 ÷ (1 – 0.20) = $10. You keep $2, which is 20% of $10.',
  },
  q14: {
    question: 'Cost $10, sold for $15. What is your margin as a % of the selling price?',
    options: ['50%', '33%', '15%', '5%'],
    explanation: 'Profit $5 ÷ price $15 = 33%. The markup, on the other hand, is 50%.',
  },
  q15: {
    question: 'You cut your price by 10% while your margin is 20%. What happens?',
    options: ['You lose 10% of your profit', 'You lose half your profit', 'Nothing, you will sell more'],
    explanation: 'On $100 of sales, you made $20. At –10%, you only make $10: you must sell twice as much to earn the same.',
  },
  q44: {
    question: 'Cost $6. You want a 25% margin on the selling price. What price?',
    options: ['$7.50', '$8', '$6.25', '$9'],
    explanation: 'Price = cost ÷ (1 – margin) = 6 ÷ 0.75 = $8. Check: $2 of profit on $8 is indeed 25%.',
  },
  q45: {
    question: '“If I am more expensive than my neighbour, I will definitely lose all my customers.”',
    options: ['True', 'False'],
    explanation: 'False: customers also pay for the welcome, proximity, availability and trust. Price is just one factor among others.',
  },
  q16: {
    question: 'An item costs $2. At a rate of 2,900 FC/$, what is its cost in FC?',
    options: ['5,800 FC', '2,900 FC', '4,500 FC', '6,000 FC'],
    explanation: '2 × 2,900 = 5,800 FC. With your margin, your selling price must be above that.',
  },
  q17: {
    question: 'The franc loses 10% against the dollar. You buy in $. What do you do?',
    options: ['I keep my FC prices', 'I raise my FC prices by about 10%', 'I lower my prices to sell more'],
    explanation: 'Otherwise, you sell below your new replacement cost and your capital melts away.',
  },
  q18: {
    question: '“Keeping your takings in francs for a month is risk-free.”',
    options: ['True', 'False'],
    explanation: 'False: when the currency is depreciating, money kept in local currency loses value. Convert the share meant for restocking.',
  },
  q46: {
    question: 'You buy a bag for $20. The rate goes from 2,800 to 2,950 FC/$. What is the bag’s new cost in FC?',
    options: ['56,000 FC', '59,000 FC', '57,500 FC', '62,000 FC'],
    explanation: '20 × 2,950 = 59,000 FC, compared with 56,000 FC before. Your FC selling price must follow, or your margin disappears.',
  },
  q47: {
    question: 'The exchange rate moves every week. How should you manage your displayed prices?',
    options: ['I write them once and for all', 'A price list updated every week according to the rate', 'I display no prices and negotiate everything'],
    explanation: 'A regularly updated price list protects your margin and stays clear for customers. Prices change gradually, not suddenly.',
  },
  q19: {
    question: 'Which information is essential on a customer’s tab?',
    options: ['The colour of their house', 'Amount, date and repayment date', 'Only their employer’s name'],
    explanation: 'Amount, date and due date (plus a signature) let you track and claim the debt.',
  },
  q20: {
    question: 'A customer already owes you $12 (your limit is $10). He asks for another $5.',
    options: ['I agree, he is nice', 'I refuse new credit and offer a repayment plan', 'I agree if it is the end of the month'],
    explanation: 'A limit is only worth something if it is respected. Ask him to repay part of it first.',
  },
  q21: {
    question: '“Selling a lot on credit is always good for my business.”',
    options: ['True', 'False'],
    explanation: 'False: you can sell a lot and still go bankrupt for lack of cash to restock.',
  },
  q48: {
    question: 'Your customers’ tabs total $45. Your till holds $30. What share of your money is with customers?',
    options: ['60%', '45%', '30%', '150%'],
    explanation: '45 ÷ (45 + 30) = 60%. More than half your money is in customers’ hands: that is the signal to slow down on credit.',
  },
  q49: {
    question: 'A customer does not repay on the agreed date. What do you do first?',
    options: ['I call him out in front of the whole neighbourhood', 'I follow up politely and set a new date in writing', 'I cancel the debt to keep the friendship'],
    explanation: 'A polite reminder and a new written date preserve the relationship. And no new credit until the old one is paid off.',
  },
  q22: {
    question: 'A competitor cuts his prices by 10%. Which response lasts longest?',
    options: ['Cut by 15%', 'Improve service and build loyalty', 'Close the shop'],
    explanation: 'A price war wears down your margin. Service and relationships are your best defences.',
  },
  q23: {
    question: 'A bar of soap costs $0.50 and sells for $0.80. What does a free bar really cost you?',
    options: ['$0.80', '$0.50', '$0.30', '$1.30'],
    explanation: 'A free product costs you its cost price ($0.50), not its selling price.',
  },
  q24: {
    question: '“A loyal customer is the one who buys the cheapest.”',
    options: ['True', 'False'],
    explanation: 'False: loyal customers come back for trust, proximity and service, not just price.',
  },
  q50: {
    question: 'Your best customer buys every day. How can you thank her without hurting your margin?',
    options: ['Cut all my prices by 20%', 'A loyalty card: a small free product after 10 purchases', 'Nothing, she will come anyway'],
    explanation: 'A loyalty card rewards regularity and only costs a small product (at purchase price) after 10 sales.',
  },
  q25: {
    question: 'A customer in a hurry shows you a payment SMS. What do you do?',
    options: ['I give him his goods', 'I check my real balance before handing them over', 'I ask him to come back tomorrow'],
    explanation: 'Only your balance counts. The fake SMS is the most common scam against traders.',
  },
  q26: {
    question: 'Cash-out fee: 2%. You receive $50 by mobile. How much do the fees cost you?',
    options: ['$2', '$1', '$0.50', '$5'],
    explanation: '50 × 2% = $1. Build these fees into your margin rather than turning the customer away.',
  },
  q27: {
    question: 'Why use a Mobile Money number dedicated to the shop?',
    options: ['To pay lower fees', 'To separate and track business money', 'Because it is compulsory everywhere'],
    explanation: 'A dedicated number = an automatic record of your sales, with no mixing with your personal spending.',
  },
  q51: {
    question: 'You receive $200 a month by Mobile Money. Cashing out costs 1.5%. How much do you save by paying your supplier directly by mobile?',
    options: ['$3', '$1.50', '$15', '$30'],
    explanation: '200 × 1.5% = $3 a month, or $36 a year. Keeping the money on mobile to pay your suppliers avoids cash-out fees.',
  },
  q52: {
    question: 'Your Mobile Money PIN should be…',
    options: ['Known by your assistant to go faster', 'Secret, and changed if someone has seen it', 'Written on the back of the phone'],
    explanation: 'The PIN is the key to your mobile till. If needed, give your assistant a separate account or number, never your code.',
  },
  q28: {
    question: 'Which pay system motivates a salesperson the most?',
    options: ['A very high fixed salary', 'A modest fixed salary + a bonus on sales', 'No salary, just meals'],
    explanation: 'The bonus aligns the salesperson’s interest with the shop’s and only costs you if sales grow.',
  },
  q29: {
    question: '“With a family member, there is no need for written rules.”',
    options: ['True', 'False'],
    explanation: 'False: it is precisely with family that unspoken things create the biggest conflicts.',
  },
  q30: {
    question: 'Cash shortfalls appear when your assistant is alone.',
    options: ['I fire him immediately', 'I set up counting together and follow the facts', 'I say nothing'],
    explanation: 'First the procedure, then a decision based on facts. That protects the shop and the relationship.',
  },
  q53: {
    question: 'Your salesperson earns $40 fixed + 5% of sales. He sells $600 this month. How much do you pay him?',
    options: ['$70', '$45', '$30', '$100'],
    explanation: '40 + (600 × 5%) = 40 + 30 = $70. The bonus is only paid because the sales are there.',
  },
  q31: {
    question: 'You borrow $100 at 4% a month for 3 months (simple interest). How much interest?',
    options: ['$4', '$12', '$48', '$3'],
    explanation: '100 × 4% × 3 = $12. Your stock must generate more than $12 of profit over the period.',
  },
  q32: {
    question: 'Which financing is often the cheapest for a small trader?',
    options: ['Supplier credit', 'The neighbourhood moneylender', 'An overdraft'],
    explanation: 'Supplier credit is often free if you resell before the due date.',
  },
  q33: {
    question: 'A microfinance offers you $300 but you have no clear plan.',
    options: ['I accept, we’ll see', 'I only borrow for a need I have costed', 'I accept and repay from the till'],
    explanation: 'A loan without a plan often ends up as consumption, and the interest runs anyway.',
  },
  q54: {
    question: 'A neighbourhood moneylender charges 10% a week. Interest on $50 for 4 weeks (simple interest)?',
    options: ['$5', '$20', '$10', '$40'],
    explanation: '50 × 10% × 4 = $20, which is 40% in one month! Very few activities earn that much: it is a trap to avoid.',
  },
  q55: {
    question: 'You are in a savings circle of 10 people paying $20 a month. When should you ask to receive the pot?',
    options: ['At random', 'When I have a specific, profitable stock purchase to make', 'As early as possible, for a party'],
    explanation: 'The pot is interest-free financing: use it for a costed investment, not for consumption.',
  },
  q34: {
    question: 'When should you open a second outlet?',
    options: ['As soon as I have a bit of money', 'When the first one is profitable and runs without me', 'When a friend advises me to'],
    explanation: 'A fragile first outlet + a second one = two problems. Growth rests on a solid base.',
  },
  q35: {
    question: 'You are unsure about a location. What do you do first?',
    options: ['I sign a one-year lease', 'I test with a small stall for 2 weeks', 'I choose the cheapest rent'],
    explanation: 'Testing costs little and gives you real figures before you commit.',
  },
  q36: {
    question: '“With two shops, I can do without the cash book.”',
    options: ['True', 'False'],
    explanation: 'False: the more you grow, the more tracking tools become essential to stay in control.',
  },
  q56: {
    question: 'Your 2nd kiosk makes $90 of margin a month. Rent $30, salesperson $45. What profit?',
    options: ['$15', '$90', '$45', '$60'],
    explanation: '90 – 30 – 45 = $15. It is positive but fragile: one bad week and the kiosk costs more than it brings in.',
  },
};
