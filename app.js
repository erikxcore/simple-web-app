let express = require('express');
let cookieParser = require('cookie-parser')
const uuidv1 = require('uuid/v1');
const optimizelyClientInstance = require('./optimizely');
let device = require('express-device');


let app = express();
app.use(cookieParser());
app.use(device.capture());

// Simple web server with two pages
app.get('/', function (req, res) {

	// Feature flag
	const enabled = optimizelyClientInstance.isFeatureEnabled('star_wars_quote', uuidv1());
	let animate = optimizelyClientInstance.getFeatureVariableBoolean('star_wars_quote', 'animate', uuidv1());
	let enabledFeaturedHTML = null;
	if (enabled) {
	  let starwars = require('starwars');
	  console.log("star wars quote feature enabled!");
	  console.log("star wars quote feature variable for animate:", animate);
	  if(animate){
	  	enabledFeaturedHTML = `<script type="text/javascript">
	  	var i = 0;
		var txt = "${starwars()}";
		var speed = 50;
		function typeWriter() {
		  if (i < txt.length) {
		    document.body.innerHTML += txt.charAt(i);
		    i++;
		    setTimeout(typeWriter, speed);
		  }
		}
		typeWriter();
		</script>`;
	  }else{
	  	enabledFeaturedHTML = '<h2>'+starwars()+'</h2>'
	  }
	  console.log(starwars());
	}

	const enabled_nav = optimizelyClientInstance.isFeatureEnabled('site_navigation', uuidv1());
	console.log("Navigation feature enabled?", enabled_nav);

	// Check & Set attributes
	let hasDevCookie = false;
	if(req.cookies['developer_cookie']){
		hasDevCookie = true;
	}

	console.log("Device Type detected" , req.device.type);
	console.log("Has Dev Cookie?", hasDevCookie);
	let attributes = {
	  device : req.device.type,
	  developer_cookie: hasDevCookie,
	};

	console.log("Attributes:",attributes);

	// Feature experiment to display nav links or not
	var variation = optimizelyClientInstance.activate('navigation_enabled_experiment', uuidv1(), attributes);

	// Force debug without adjusting traffic allocation.
	if(hasDevCookie){
		optimizelyClientInstance.setForcedVariation('navigation_enabled_experiment', uuidv1(), 'variation_2')
	}

	if (variation === 'variation_1') {
	  // execute code for variation_1
	  console.log("don't show nav, variation 1");
	  res.send('<h1>Hello World!</h1>'+enabledFeaturedHTML);
	} else if (variation === 'variation_2') {
	  // execute code for variation_2
	  console.log("show nav, variation 2");
	  res.send('<a href="/about">About</a><h1>Hello World!</h1>'+enabledFeaturedHTML);
	} else {
	  // execute default code
	  console.log("don't show nav, no variation detected");
	  if(enabled)
	  res.send('<h1>Hello World!</h1>'+enabledFeaturedHTML);
	}
  	
});

app.get('/about', function (req, res) {
	let hasDevCookie = false;

	if(req.cookies['developer_cookie']){
		hasDevCookie = true;
	}
	console.log("Device Type detected" , req.device.type);
	console.log("Has Dev Cookie?", hasDevCookie);

	let attributes = {
	  device : req.device.type,
	  developer_cookie: hasDevCookie,
	};

	console.log("Attributes:",attributes);

	optimizelyClientInstance.track('About Page Page Visit', uuidv1(), attributes);
	res.send('<a href="/">Home</a><h1>About Page!</h1>');
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});