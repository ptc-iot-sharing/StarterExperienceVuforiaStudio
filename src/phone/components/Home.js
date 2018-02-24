// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available
$scope.$on("$ionicView.afterEnter", function (event) {
    var $ionicSideMenuDelegate = $injector.get("$ionicSideMenuDelegate");
    $ionicSideMenuDelegate.canDragContent(false);
}
);
var niBoxModelItems = ['/6/97', '/6/21', '/6/205', '/6/55', '/6/209', '/6/200', '/6/141', '/6/39', '/6/153',
    '/6/155', '/6/96', '/6/74', '/6/60', '/6/40', '/6/94', '/6/189', '/6/164', '/6/130', '/6/127'];
var showNiBoxInAr = true;
// update the bars when the value from twx changes
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['showNiBoxInAr']", function (newVal) {
    if (newVal !== undefined) {
        showNiBoxInAr = newVal;
    }
}
);
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
// update the bars when the value from twx changes
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan1YAccel'] + app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan1XAccel']", function () {
    if ($scope.app.mdl.TurbinesDemoThing)
        $scope.view.wdg['fan1AccelBar'].value = Math.sqrt(Math.pow($scope.app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan1YAccel'], 2) + Math.pow($scope.app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan1XAccel'], 2)).toFixed(2);
}
);
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan2YAccel'] + app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan2XAccel']", function () {
    if ($scope.app.mdl.TurbinesDemoThing)
        $scope.view.wdg['fan2AccelBar'].value = Math.sqrt(Math.pow($scope.app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan2XAccel'], 2) + Math.pow($scope.app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan2YAccel'], 2)).toFixed(2);
}
);
// handle the status of the fans
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan1Running']", function (newVal) {
    fanModelItems.fan1.spinning = newVal;
    $scope.view.wdg['fan1StartButton'].rz = newVal ? -45 : 0;
}
);
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan2Running']", function (newVal) {
    fanModelItems.fan2.spinning = newVal;
    $scope.view.wdg['fan2StartButton'].rz = newVal ? -45 : 0;
}
);
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan1Anomaly']", function (newVal) {
    fanModelItems.fan1.alert = newVal;
    if (!newVal) {
        tml3dRenderer.setColor("model-1-" + fanModelItems.fan1.modelItem, "rgba(127,127,127,1)");
    }
}
);
$scope.$watch("app.mdl['TurbinesDemoThing'].svc['GetPropertyValues'].data.current['Fan2Anomaly']", function (newVal) {
    fanModelItems.fan2.alert = newVal;
    if (!newVal) {
        tml3dRenderer.setColor("model-1-" + fanModelItems.fan2.modelItem, "rgba(127,127,127,1)");
    }
}
);
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
