
var fieldManager       = null;
var sceneManagerField  = null;
var historyManager     = null;
var environmentManager = null;

$(document).ready( function(){

    // check device

    // read url message and load 
    historyManager = new HistoryManager();
    historyManager.initialize();
    environmentManager = new EnvironmentManager();
    environmentManager.initialize();

    // build canvas object
    sceneManagerField = new SceneManager( $("#DragCanvas"), TOUCH_DEVICE );
    sceneManagerField.startInterval(false);
    fieldManager = new FieldManager( $("#DragCanvas"), historyManager, environmentManager );
    sceneManagerField.changeScene(fieldManager);



});