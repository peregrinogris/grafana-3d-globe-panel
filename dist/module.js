'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.PanelCtrl=exports.GlobeCtrl=undefined;var _config=require('app/core/config');var _config2=_interopRequireDefault(_config);var _sdk=require('app/plugins/sdk');var _angular=require('angular');var _angular2=_interopRequireDefault(_angular);require('./Cesium/Widgets/widgets.css!');require('./css/3d-globe-panel.css!');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}require('./Cesium/Cesium.js');var BASE_URL=_config2.default.appSubUrl+'/public/plugins/satellogic-3d-globe-panel';var Cesium=window.Cesium;var panelSettings={url:'',bingKey:''};window.CESIUM_BASE_URL=BASE_URL+'/Cesium/';
var rectangle=Cesium.Rectangle.fromDegrees(-180.0,-90.0,180.0,90.0);
Cesium.Camera.DEFAULT_VIEW_FACTOR=0.0;
var GlobeCtrl=exports.GlobeCtrl=function(_PanelCtrl){_inherits(GlobeCtrl,_PanelCtrl);function GlobeCtrl($scope,$injector,$rootScope){_classCallCheck(this,GlobeCtrl);var _this=_possibleConstructorReturn(this,(GlobeCtrl.__proto__||Object.getPrototypeOf(GlobeCtrl)).call(this,$scope,$injector));_this.overrideTimelineLabels=function(dashboard){
Cesium.Timeline.prototype.makeLabel=function makeLabel(_time){var timelineMonthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];var millisecondString=' UTC';var time=_time;var tzOffset=new Date().getTimezoneOffset();var twoDigits=function twoDigits(num){return num<10?'0'+num.toString():num.toString();};if(!dashboard.isTimezoneUtc()&&tzOffset!==0){time=Cesium.JulianDate.addMinutes(time,-1*tzOffset,new Cesium.JulianDate());millisecondString=' UTC'+(tzOffset>0?'-':'+')+(twoDigits(Math.floor(tzOffset/60))+':')+(''+twoDigits(tzOffset%60));}var gregorian=Cesium.JulianDate.toGregorianDate(time);var millisecond=gregorian.millisecond;
if(millisecond>0&&this._timeBarSecondsSpan<3600){millisecondString=Math.floor(millisecond).toString();while(millisecondString.length<3){millisecondString='0'+millisecondString;}millisecondString='.  '+millisecondString;}
return timelineMonthNames[gregorian.month-1]+' '+gregorian.day+' '+gregorian.year+' '+twoDigits(gregorian.hour)+':'+twoDigits(gregorian.minute)+':'+twoDigits(gregorian.second)+millisecondString;};};_this.onInitEditMode=function(){_this.addEditorTab('Options','public/plugins/satellogic-3d-globe-panel/editor.html',2);};_this.registerViewer=function(viewer){_this.viewer=viewer;_this.updateViewerTimespan();};_this.updateViewerTimespan=function(){var _this$timeSrv$timeRan=_this.timeSrv.timeRange(),from=_this$timeSrv$timeRan.from,to=_this$timeSrv$timeRan.to;from=Cesium.JulianDate.fromDate(from.toDate(),new Cesium.JulianDate());to=Cesium.JulianDate.fromDate(to.toDate(),new Cesium.JulianDate());
_this.viewer.clock.startTime=from;_this.viewer.clock.stopTime=to;
_this.viewer.timeline.zoomTo(from,to);};_this.updateViewerHeight=function(){
_this.viewer.container.style.height=Math.ceil(_this.height)+'px';
window.setTimeout(function(){_this.viewer.camera.setView({destination:rectangle});},100);};_this.refresh=function(){if(_this.panel.bingKey){Cesium.BingMapsApi.defaultKey=_this.panel.bingKey;}if(_this.viewer&&_this.panel.url){
var _this$timeSrv$timeRan2=_this.timeSrv.timeRange(),from=_this$timeSrv$timeRan2.from,to=_this$timeSrv$timeRan2.to;
var url=_this.templateSrv.replace(_this.panel.url+'?'+_this.panel.query,_this.panel.scopedVars,'pipe').replace(/\$timeFrom/g,+from).replace(/\$timeTo/g,+to);_this.viewer.dataSources.removeAll(true);_this.viewer.dataSources.add(Cesium.CzmlDataSource.load(url)).then(null,function(err){_this.rootScope.appEvent('alert-error',['Plugin Error','Error while retrieving CZML data: '+err]);});}else if(_this.viewer){
_this.updateViewerTimespan();}};_this.rootScope=$rootScope;_this.panel=_.defaults(_this.panel,panelSettings);_this.timeSrv=$injector.get('timeSrv');_this.templateSrv=$injector.get('templateSrv');_this.events.on('refresh',_this.refresh);_this.events.on('init-edit-mode',_this.onInitEditMode);_this.events.on('render',_this.updateViewerHeight);
_this.overrideTimelineLabels($scope.ctrl.dashboard);_this.refresh();return _this;}return GlobeCtrl;}(_sdk.PanelCtrl);GlobeCtrl.templateUrl='module.html';
_angular2.default.module('grafana.directives').directive('gfSatellogic3dGlobe',function(){return{template:'<div class="cesiumContainer"></div>',replace:true,restrict:'E',link:function link(scope,element){var STARS_FOLDER=BASE_URL+'/Cesium/Assets/Textures';var viewer=new Cesium.Viewer(element[0],{skyBox:new Cesium.SkyBox({sources:{positiveX:STARS_FOLDER+'/SkyBox/tycho2t3_80_px.jpg',negativeX:STARS_FOLDER+'/SkyBox/tycho2t3_80_mx.jpg',positiveY:STARS_FOLDER+'/SkyBox/tycho2t3_80_py.jpg',negativeY:STARS_FOLDER+'/SkyBox/tycho2t3_80_my.jpg',positiveZ:STARS_FOLDER+'/SkyBox/tycho2t3_80_pz.jpg',negativeZ:STARS_FOLDER+'/SkyBox/tycho2t3_80_mz.jpg'}}),sceneMode:Cesium.SceneMode.SCENE2D,animation:false,geocoder:false,shadows:true});
viewer.scene.globe.enableLighting=true;viewer.scene.globe.lightingFadeOutDistance=65000000.0;
viewer.imageryLayers.get(0).imageryProvider.readyPromise.then(function(){scope.ctrl.updateViewerHeight();});scope.ctrl.registerViewer(viewer);}};});exports.PanelCtrl=GlobeCtrl;