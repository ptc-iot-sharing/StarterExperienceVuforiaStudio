// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available
$scope.$on("$ionicView.afterEnter", function (event) {
    var $ionicSideMenuDelegate = $injector.get("$ionicSideMenuDelegate");
    $ionicSideMenuDelegate.canDragContent(false);
}
);
/** 
 * Examples of some model items that we animate
 */
var fanModelItems = {
    fan1: {
        modelItem: "/6/132/7",
        spinning: false,
        alert: false
    }
    ,
    fan2: {
        modelItem: "/6/145/7",
        spinning: false,
        alert: false
    }
};
// handle panel visibility
$scope.togglePanelVisibility = function () {
    $scope.view.wdg["propertyDisplayCard"].visible = !$scope.view.wdg["propertyDisplayCard"].visible;
}
/**
 * The color stops for the animation.
 */
var startColor = [127, 127, 127];
var endColor = [255, 0, 0];
/**
 * Returns the value resulting by interpolating a starting value and a final value using a specified interpolation fraction.
 */
function numberByInterpolatingNumbers(fraction, start, end) {
    return start + (end - start) * fraction;
}
/**
 * Returns a color string that represents the interpolation of the start and end color, using the specified interpolation fraction.
 */
function colorStringWithFraction(fraction) {
    return Math.round(numberByInterpolatingNumbers(fraction, startColor[0], endColor[0])) + ', ' +
        Math.round(numberByInterpolatingNumbers(fraction, startColor[1], endColor[1])) + ', ' +
        Math.round(numberByInterpolatingNumbers(fraction, startColor[2], endColor[2]));
}
/**
 * The current animation step, which loops back after reaching 2
 */
var animationStep = 0;
/**
 * The step size of each animation frame
 */
var animationStepSize = 0.05;
function animationFrame() {
    window.requestAnimationFrame(animationFrame);
    animationStep += animationStepSize;
    if (animationStep > 2) animationStep = 0;
    var fraction = animationStep > 1 ?
        (2 - animationStep) :
        (animationStep);
    if (showNiBoxInAr !== undefined) {
        for (let index = 0; index < niBoxModelItems.length; index++) {
            const element = niBoxModelItems[index];
            tml3dRenderer.setProperties('model-1-' + element, { hidden: !showNiBoxInAr });
        }
    }
    for (const key in fanModelItems) {
        if (fanModelItems.hasOwnProperty(key)) {
            var identifier = "model-1-" + fanModelItems[key].modelItem;
            if (fanModelItems[key].alert) {
                tml3dRenderer.setColor(identifier, "rgba(" + colorStringWithFraction(fraction) + ",1)");
            }
            if (fanModelItems[key].spinning) {
                tml3dRenderer.setRotation(identifier, 90, 0, numberByInterpolatingNumbers(animationStep, 0, 360));
            }
        }
    }
}
window.requestAnimationFrame(animationFrame);

// intitialize simulator for the properties
var Simple1DNoise = function () {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES - 1;
    var amplitude = 1;
    var scale = 1;
    var offset = 0;
    var x = 0;
    var r = [];
    for (var i = 0; i < MAX_VERTICES; ++i) {
        r.push(Math.random());
    }
    var getVal = function () {
        x++;
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * (3 - 2 * t);
        /// Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = (xMin + 1) & MAX_VERTICES_MASK;
        var y = lerp(r[xMin], r[xMax], tRemapSmoothstep);
        return y * amplitude + offset;
    };
    /**
      * Linear interpolation function.
      * @param a The lower integer value
      * @param b The upper integer value
      * @param t The value between the two
      * @returns {number}
      */
    var lerp = function (a, b, t) {
        return a * (1 - t) + b * t;
    };
    // return the API
    return {
        getVal: getVal,
        setAmplitude: function (newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function (newScale) {
            scale = newScale;
        },
        setOffset: function (newOffset) {
            offset = newOffset;
        }
    };
};
var temperatureSimulator = new Simple1DNoise();
temperatureSimulator.setOffset(80);
temperatureSimulator.setScale(0.1);
temperatureSimulator.setAmplitude(30);
var vibrationSimulator = new Simple1DNoise();
vibrationSimulator.setOffset(10);
vibrationSimulator.setAmplitude(3);
var labelSimulator = new Simple1DNoise();
labelSimulator.setOffset(3);
labelSimulator.setAmplitude(6);
var pressureSimulator = new Simple1DNoise();
pressureSimulator.setOffset(20);
pressureSimulator.setAmplitude(80);
// create intervals for each of the simulated data.
var simulatorInterval = $interval(
    function () {
        // here you can set the value of some widgets according to the simulators
    }, 1000);
$scope.$on('$destroy', function () {
    // Make sure that the interval is destroyed too
    if (angular.isDefined(simulatorInterval)) {
        $interval.cancel(simulatorInterval);
        simulatorInterval = undefined;
    }
});


// called when the new step starts playing. The arg comes in this format: "currStep/totalSteps: Step description". For example "1/5: Remove the case". The step description comes directly from the PVI
$scope.$on('newStep', function(evt,arg) {
    //alert("new step: "+ arg); 
     $scope.setWidgetProp("label-2", "text", arg);
  
  }
            );
  
  $scope.$watch('view.wdg["model-2"].playing', function(val) {
    // add or remove the playing class 
    var buttonElement = angular.element(document.querySelector('twx-widget[widget-id="button-6"] button'));
    if(val) {
      $scope.view.wdg["label-2"].visible = true;
      buttonElement.removeClass("ion-play");
      buttonElement.addClass("ion-pause");
    }
    else {
      $scope.view.wdg["label-2"].visible = false;
      buttonElement.removeClass("ion-pause");
      buttonElement.addClass("ion-play");
    }
  });