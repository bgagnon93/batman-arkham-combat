$(function () {
	$(window).resize(function(){
		winSize();
	}).resize();

	$("#reset").click(function(event) {
		reset();
	});

	$("#strike").click(function(event) {
		registerHit("Strike");
	});

	$("#counter").click(function(event) {
		registerHit("Counter");
	});

	$("#groundpound").click(function(event) {
		registerHit("Ground Pound");
	});

	$("#stun").click(function(event) {
		registerHit("Stun");
	});

	$("#ultrastun").click(function(event) {
		registerHit("Ultra Stun");
	});

	$("#aerial").click(function(event) {
		registerHit("Aerial Attack");
	});

	$("#beatdown").click(function(event) {
		registerHit("Beatdown");
	});

	$("#takedown").click(function(event) {
		registerHit("Takedown");
	});

	$("#multiground").click(function(event) {
		registerHit("Multiground");
	});

	$("#disarm").click(function(event) {
		registerHit("Disarm");
	});

	$("#swarm").click(function(event) {
		registerHit("Bat Swarm");
	});

	$("#batarang").click(function(event) {
		registerHit("Batarang");
	});

	$("#batclaw").click(function(event) {
		registerHit("Batclaw");
	});

	$("#freeze").click(function(event) {
		registerHit("Freeze Gren.");
	});

	$("#gel").click(function(event) {
		registerHit("Explosive Gel");
	});

	$("#electric").click(function(event) {
		registerHit("Electric Gun");
	});
});

var totalPoints = 0;
var baseScore = 0;
var multiplier = 0;

var variation = 0;
var variationBonus = 0;

var gadgetVariation = 0;
var gadgetVariationBonus = 0;

var isGrounded = false;
var isStunned = false;

var special = false;
var specialCount = 0;

var currentVarianceMoves = [];
var currentGadgets = [];

var scoreboardHtml = "snippets/scoreboard.html";
var scoreboardxsHtml = "snippets/scoreboard-xs.html";

winSize();

disableButtons();

function winSize() {
	if(window.innerWidth > 767) {
		$ajaxUtils.sendGetRequest(
			scoreboardHtml,
			function (responseText) {
				document.querySelector("#scoreb")
				.innerHTML = responseText;
				updateScore();
			},
			false);
	} else {
		$ajaxUtils.sendGetRequest(
			scoreboardxsHtml,
			function (responseText) {
				document.querySelector("#scoreb")
				.innerHTML = responseText;
				updateScore();
			},
			false);
	}
}

var moveData = $ajaxUtils.sendGetRequest("data/moves.json", 
	function (res) {
		moveData = res;
});



function reset() {
	totalPoints = 0;
	baseScore = 0;
	variation = 0;
	gadgetVariation = 0;
	multiplier = 0;
	variationBonus = 0;
	gadgetVariationBonus = 0;

	isGrounded = false;
	isStunned = false;
	special = false;

	updateScore();
	disableButtons();
	var currentVarianceMoves = [];
	var currentGadgets = [];
}

function registerHit(hit) {
	var hitData = moveData[hit];
	handleMultiplier(hitData);
	baseScore += multiplier * hitData["Point Value"];
	isGrounded = hitData["Grounds"];
	isStunned = hitData["Stuns"];

	handleVariance(hit, hitData);
	handleGadgetVariance(hit, hitData);

	totalPoints = baseScore + variationBonus + gadgetVariationBonus;

	updateScore();
	btnGround();
	btnStun();
	btnSpecial();
}

function handleMultiplier(hitData) {
	if(multiplier < 3) {
		multiplier += hitData.Multiplier[0];
		specialCount += hitData.Multiplier[0];
	}
	else {
		multiplier += hitData.Multiplier[1];
		specialCount += hitData.Multiplier[1];
	}
	if(specialCount >= 5)
		special = true;
	if(hitData["Requires Special"]) {
		specialCount = 0;
		special = false;
	}
}

function handleVariance(hit, hitData) {
	var moveRequired = hitData["Required for Variance"];
	if(moveRequired && !currentVarianceMoves.includes(hit)) {
		currentVarianceMoves.push(hit);
		variation += 1;
	}
	calculateVariationBonus();
}

function handleGadgetVariance(hit, hitData) {
	var moveRequired = hitData["Required for Gadget Variance"];
	if(moveRequired && !currentGadgets.includes(hit)) {
		currentGadgets.push(hit);
		gadgetVariation += 1;
	}
	calculateGadgetVariationBonus();
}

function calculateVariationBonus() {
	switch(variation) {
		case 5:
			variationBonus = 500;
			break;
		case 6:
			variationBonus = 1000;
			break;
		case 7:
			variationBonus = 2000;
			break;
		case 8:
			variationBonus = 3000;
			break;
		case 9:
			variationBonus = 4000;
			break;
		case 10:
			variationBonus = 5000;
			break;
		case 11:
			variationBonus = 6000;
			break;
		case 12:
			variationBonus = 7000;
			break;
	}
}

function calculateGadgetVariationBonus() {
	switch(gadgetVariation) {
		case 1:
			gadgetVariationBonus = 100;
			break;
		case 2:
			gadgetVariationBonus = 250;
			break;
		case 3:
			gadgetVariationBonus = 500;
			break;
		case 4:
			gadgetVariationBonus = 1000;
			break;
		case 5:
			gadgetVariationBonus = 2000;
			break;
	}
}

function updateScore() {
	document.querySelector("#total-points").innerHTML = "<span>" + totalPoints + "</span>";
	document.querySelector("#base-score").innerHTML = "<span>" + baseScore + "</span>";
	document.querySelector("#multiplier").innerHTML = "<span>" + multiplier + "</span>";
	document.querySelector("#variation").innerHTML = "<span>" + variation + "</span>";
	document.querySelector("#variation-bonus").innerHTML = "<span>" + variationBonus + "</span>";
	document.querySelector("#gadget-variation").innerHTML = "<span>" + gadgetVariation + "</span>";
	document.querySelector("#gadget-variation-bonus").innerHTML = "<span>" + gadgetVariationBonus + "</span>";

	if(special) {
		document.querySelector("#multiplier").style.color = "#D4AF37";
		document.querySelector("#multiplier").style["text-shadow"] = "0px 0px 10px #D4AF37";
	}
	else {
		document.querySelector("#multiplier").style.color = "#C6C6C6";
		document.querySelector("#multiplier").style["text-shadow"] = "unset";
	}
}

function disableButtons() {
	document.querySelector("#groundpound").disabled = true;
	document.querySelector("#aerial").disabled = true;
	document.querySelector("#beatdown").disabled = true;
	document.querySelector("#takedown").disabled = true;
	document.querySelector("#multiground").disabled = true;
	document.querySelector("#disarm").disabled = true;
	document.querySelector("#swarm").disabled = true;
}

function btnGround() {
	document.querySelector("#groundpound").disabled = !isGrounded;
}

function btnStun() {
	document.querySelector("#aerial").disabled = !isStunned;
	document.querySelector("#beatdown").disabled = !isStunned;
}

function btnSpecial() {
	document.querySelector("#takedown").disabled = !special;
	document.querySelector("#multiground").disabled = !special;
	document.querySelector("#disarm").disabled = !special;
	document.querySelector("#swarm").disabled = !special;
}


// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

function handleScoreboard() {

}

