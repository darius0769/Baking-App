'use strict';

// Data /////////////////////////////////////////////////////////////////////////////////////
const account1 = {
  owner: 'Jason Momoa',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Tom Cruise',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount, timer, balance;

//Transaction list //////////////////////////////////////////////////////////////////////////
const displayMovements = function (movements, movementsDates) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const date = new Date(currentAccount.movementsDates[i]);
    const date1 = new Intl.DateTimeFormat(currentAccount.locale, {
      minute: 'numeric',
      hour: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const formatedMov = new Intl.NumberFormat(currentAccount.locale, {
      style: 'currency',
      currency: currentAccount.currency,
    }).format(mov);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${date1}</div>
      <div class="movements__value">${formatedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Balance ///////////////////////////////////////////////////////////////////////////////////
const calcBalance = function (movements) {
  const balance = movements.reduce(function (sum, mov) {
    return sum + mov;
  }, 0);
  const formatedBalance = new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(balance);
  labelBalance.textContent = `${formatedBalance}`;
  return balance.toFixed(2);
};

//Incoming //////////////////////////////////////////////////////////////////////////////////
const incomingSum = function (movements) {
  const incoming = movements.reduce(function (sum, mov) {
    if (mov > 0) return sum + mov;
    else return sum + 0;
  }, 0);
  let incoming1 = new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(incoming);
  labelSumIn.textContent = `${incoming1}`;
};

//Outgoing //////////////////////////////////////////////////////////////////////////////////
const outgoingSum = function (movements) {
  const outgoing = -movements.reduce(function (sum, mov) {
    if (mov < 0) return sum + mov;
    else return sum + 0;
  }, 0);
  let outgoing1 = new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(outgoing);
  labelSumOut.textContent = `${outgoing1}`;
};

//Interest //////////////////////////////////////////////////////////////////////////////////
const calcInterest = function () {
  const interest = (balance * currentAccount.interestRate) / 100;
  let interest1 = new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(interest);
  labelSumInterest.textContent = `${interest1}`;
};

//Page refresh //////////////////////////////////////////////////////////////////////////////
const pageRefresh = function () {
  displayMovements(currentAccount.movements);
  balance = calcBalance(currentAccount.movements);
  incomingSum(currentAccount.movements);
  outgoingSum(currentAccount.movements);
  calcInterest();
};

//login /////////////////////////////////////////////////////////////////////////////////////
//Generate username
for (const acc of accounts) {
  let temp = '';
  let user = acc.owner.split(' ');
  for (const i of user) {
    temp += i[0];
  }
  acc.username = temp;
}

//Logout timer
const coolDown = function () {
  let time = 300;
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    console.log(`${min}:${sec}`);
    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      clearInterval(timer);
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Generate date
let dateNow = new Date();

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = false;
  currentAccount = accounts.find(
    acc => inputLoginUsername.value === acc.username
  );
  if (
    !accounts.includes(currentAccount) ||
    currentAccount.pin != inputLoginPin.value
  )
    alert('WRONG CREDENTIALS ENTERED');
  else {
    inputLoginUsername.value = inputLoginPin.value = '';
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    //Date update
    const dateUpdate = function () {
      dateNow = new Date();
      const dateFormated = new Intl.DateTimeFormat(currentAccount.locale, {
        minute: 'numeric',
        second: '2-digit',
        hour: 'numeric',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateNow);
      labelDate.textContent = dateFormated;
    };
    dateUpdate();
    setInterval(dateUpdate, 1000);

    if (timer) clearInterval(timer);

    timer = coolDown();
    pageRefresh();
    containerApp.style.opacity = 100;
  }
});

//Transfer money ////////////////////////////////////////////////////////////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  coolDown();
  let account = 0;
  if (balance >= inputTransferAmount.value) {
    for (const i of accounts) {
      if (i.username === inputTransferTo.value) {
        account = i;
        break;
      }
    }
    if (
      account != 0 &&
      inputTransferAmount.value >= 0 &&
      inputTransferTo.value != currentAccount.username
    ) {
      currentAccount.movements.push(Number(-inputTransferAmount.value));
      account.movements.push(Number(inputTransferAmount.value));
      currentAccount.movementsDates.push(dateNow.toISOString());
      account.movementsDates.push(dateNow.toISOString());
      pageRefresh();
    } else alert('INVALID TRANSFER DATA INPUT');
    inputTransferTo.value = inputTransferAmount.value = '';
  } else alert('AMOUNT NOT AVAILABLE IN ACCOUNT');
});

//Close account /////////////////////////////////////////////////////////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let index;
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    index = accounts.findIndex(function (acc) {
      return inputCloseUsername.value === acc.username;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  } else alert("CREDENTIALS DON'T MATCH, TRY AGAIN...");
  inputCloseUsername.value = inputClosePin.value = '';
});

//Loan request //////////////////////////////////////////////////////////////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  coolDown();
  if (
    currentAccount.movements.some(function (mov) {
      return mov >= 0.1 * inputLoanAmount.value;
    })
  ) {
    if (inputLoanAmount.value > 0) {
      currentAccount.movements.push(Number(inputLoanAmount.value));
      currentAccount.movementsDates.push(dateNow.toISOString());
      inputLoanAmount.value = '';
      setTimeout(function () {
        pageRefresh();
      }, 1500);
    } else alert('INVALID AMOUNT ENTERED');
  } else alert('YOU ARE NOT YET ELIGIBLE TO APPLY LOAN FOR THE SPECIFIED AMOUNT');
});

//Sort transactions /////////////////////////////////////////////////////////////////////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  coolDown();
  if (!sorted) {
    let temp = [...currentAccount.movements];
    temp.sort((a, b) => a - b);
    displayMovements(temp);
    sorted = !sorted;
  } else if (sorted) {
    displayMovements(currentAccount.movements);
    sorted = !sorted;
  }
});
