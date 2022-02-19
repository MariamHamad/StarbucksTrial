const container = document.querySelector(".container");
const coffees = [
  {
    name: "Espresso",
    image: "images/espresso.jpg"
  },
  {
    name: "Espresso ConPanna",
    image: "images/espressoConPanna.jpg"
  },
  {
    name: "Caffe Americano",
    image: "images/caffeAmericano.jpg"
  },
  {
    name: "Cappuccino",
    image: "images/cappuccino.jpg"
  },
  {
    name: " Caffe Misto",
    image: "images/caffeMisto.jpg"
  },
  {
    name: " Caramel Macciato",
    image: "images/caramelMacciato.jpg"
  },
  {
    name: "Dark Chocolate Mocha",
    image: "images/darkChocolateMocha.jpg"
  },
  {
    name: "White Chocolate Mocha",
    image: "images/whiteChocolateMocha.jpg"
  },
  {
    name: "Peppermint Mocha",
    image: "images/peppermintWhiteChocolateMocha.jpg"
  }
];
const showCoffees = () => {
  let output = "";
  coffees.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#">Taste</a>
              </div>
              `)
  );
  container.innerHTML = output;
};


document.addEventListener("DOMContentLoaded", showCoffees);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}

// Code to handle install prompt on desktop

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});


var target = document.getElementById('target');
var watchId;

function appendLocation(location, verb) {
  verb = verb || 'updated';
  var newLocation = document.createElement('p');
  newLocation.innerHTML = 'Location ' + verb + ': ' + location.coords.latitude + ', ' + location.coords.longitude + '';
  target.appendChild(newLocation);
}

if ('geolocation' in navigator) {
  document.getElementById('askButton').addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(function (location) {
      appendLocation(location, 'fetched');
    });
    watchId = navigator.geolocation.watchPosition(appendLocation);
  });
} else {
  target.innerText = 'Geolocation API not supported.';
}


/**
 * Builds PaymentRequest for credit cards, but does not show any UI yet.
 */
function initPaymentRequest() {
  let networks = ['amex', 'jcb', 'visa', 'maestro', 'mastercard'];
  
  let supportedInstruments = [{
    supportedMethods: 'basic-card', // note that this method is deprecated and its support will be removed
    data: {
      supportedNetworks: networks, 
    }
  }, {
    supportedMethods: 'https://apple.com/apple-pay',
    data: {
        version: 2,
        supportedNetworks: networks,
        countryCode: 'US',
        merchantIdentifier: 'whatwebcando.today.sample',
        merchantCapabilities: ['supportsDebit', 'supportsCredit', 'supports3DS']
    }
  }];

  let details = {
    total: {label: 'Donation', amount: {currency: 'EUR', value: '10.00'}},
    displayItems: [
      {
        label: 'Original donation amount',
        amount: {currency: 'EUR', value: '15.00'}
      },
      {
        label: 'Friends and family discount',
        amount: {currency: 'EUR', value: '-5.00'}
      }
    ]
  };

  return new PaymentRequest(supportedInstruments, details);
}

/**
 * Invokes PaymentRequest for credit cards.
 */
function onBuyClicked(request) {
  request.show()
    .then(instrumentResponse => sendPaymentToServer(instrumentResponse))
    .catch(err => document.getElementById('log').innerText = err);
}

/**
 * Simulates processing the payment data on the server.
 */
function sendPaymentToServer(instrumentResponse) {
  // There's no server-side component of these samples. No transactions are
  // processed and no money exchanged hands. Instantaneous transactions are not
  // realistic. Add a 2 second delay to make it seem more real.
  
  window.setTimeout(function () {
    instrumentResponse.complete('success')
        .then(() => document.getElementById('log').innerHTML = resultToTable(instrumentResponse))
        .catch(err => document.getElementById('log').innerText = err);
  }, 2000);
}

/**
 * Converts the payment instrument into a JSON string.
 */
function resultToTable(result) {
  return '' +
    '' +
    '' +
    '' +
    '' +
    '' +
    '' +
    'Method name' + result.methodName + 'Billing address' + (result.details.billingAddress || {}).addressLine + ', ' + (result.details.billingAddress || {}).city + 'Card number' + result.details.cardNumber + 'Security code' + result.details.cardSecurityCode + 'Cardholder name' + result.details.cardholderName + 'Expiry date' + result.details.expiryMonth + '/' + result.details.expiryYear + '';
}

function donate() {
  if (!window.PaymentRequest) {
    alert('This browser does not support Web Payments API');
    return;
  }
    
  let request = initPaymentRequest();
  onBuyClicked(request);
}
