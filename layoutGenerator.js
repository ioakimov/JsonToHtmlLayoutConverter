
let dashboardConfig = {
	id: "1962e678-c88a-4611-9b2b-c10c9e7ee0dd",
    name: "Dashboard: User with DMP",
	containers: [ 
		{
			type: "horizontal",
			minHeight: 30,
			widgets: [
				"<img src='./images/test-logo.png' />",
				"<img src='./images/test-logo.png' />"
			]
		}, 
		{
			type: "horizontal",
			minHeight: 40,
			containers: [ 
				{
					type: "vertical",
					width: 33,
					widgets: [
						"<img src='./images/test-logo-small.png' />",
						"<img src='./images/test-logo-small.png' />"
					]
				}, 
				{
					type: "vertical",
					width: 33,
					containers: [ 
						{
							type: "horizontal",
							minHeight: 35,
							widgets: ["w3"]
						}, 
						{
							type: "horizontal",
							minHeight: 65,
							containers: [ 
								{
									type: "horizontal",
									minHeight: 35,
									widgets: ["w5"]
								}, 
								{
									type: "horizontal",
									minHeight: 65,
									containers: [ 
										{
											type: "horizontal",
											minHeight: 35,
											widgets: ["<img src='./images/test-logo.png' />"]
										}, 
										{
											type: "horizontal",
											minHeight: 65,
											widgets: ["w8"],	
										}					
									]									
								}					
							]	
						}
					]
				},
				{
					type: "vertical",
					width: 33
				}, 
			]
		}
]		
};

const HORIZONTAL_CONTAINER_TYPE = "horizontal";
const VERTICAL_CONTAINER_TYPE = "vertical";
const HORIZONTAL_CONTAINER_CSS_CLASS = "layout-container-hirizontal";
const VERTICAL_CONTAINER_CSS_CLASS = "layout-container-vertical";
const DISPLAY_NONE = "display: none";
const WIDGET_HORIZONTAL_WRAPPER_CSS_CLASS = "widget-hirizontal-wrapper";
const WIDGET_VERTICAL_WRAPPER_CSS_CLASS = "widget-vertical-wrapper";
const MOBILE_HORIZONTAL_CONTAINER_HEIGHT = 10;

/**
* Wrap specified message with HTML comment tags
**/
function strToHtmlComment(msg) {
	return "<!-- " + msg + " -->"
}

/**
* Transform Container JSON config to HTML
**/
function containerToHtml(containerConfig, dashboardLocalParams) {
	if (dashboardLocalParams.isMobile) {
		containerConfig.type = HORIZONTAL_CONTAINER_TYPE;
		containerConfig.minHeight = MOBILE_HORIZONTAL_CONTAINER_HEIGHT;
	}
	let containerHTML = "";
	//Add logs and HTML comments
	let debugMsg = JSON.stringify(containerConfig);
	containerHTML += strToHtmlComment(debugMsg);
	console.log(debugMsg);
	//Add HTML data of the container
	containerHTML += getContainerOpenTag(containerConfig, dashboardLocalParams);
	containerHTML += getContainerContent(containerConfig, dashboardLocalParams);
	containerHTML += getContainerCloseTag(containerConfig);
	return containerHTML;
}
/**
* Retrive HTML 'open-tag' for specified container config
**/
function getContainerOpenTag(containerConfig, dashboardLocalParams) {
    if (containerConfig.type) {
		switch(containerConfig.type) {
			case HORIZONTAL_CONTAINER_TYPE:
				return getHorizontalOpenTag(containerConfig, dashboardLocalParams);
				break;
			case VERTICAL_CONTAINER_TYPE:
				return getVerticalOpenTag(containerConfig, dashboardLocalParams);
				break;
			default:
				throw new Error('Unexpected type "' + containerConfig.type + '" of layout subcontainer  (containerConfig = "' + JSON.stringify(containerConfig) + '")...');
		}		
	}
	throw new Error('Type of layout subcontainer is undefined (containerConfig = "' + JSON.stringify(containerConfig) + '")');
}

/**
* Generate HTML 'open-tag' of the specified HORIZONTAL container
**/
function getHorizontalOpenTag(containerConfig, dashboardLocalParams) {
	//Calculate minHeight
	let minHeight = containerConfig.minHeight;
	if (minHeight == undefined || minHeight < 0) {
		throw new Error("minHeight is not specified for HORIZONTAL container (containerConfig = " + JSON.stringify(containerConfig)+ ")");
	}
	let minHeightParam = minHeightOrDefault(containerConfig.minHeight * dashboardLocalParams.dashboardHeight / 100, 0);
return '<div style="' 
	+ minHeightParam + ';' 
	+ '" class="' + HORIZONTAL_CONTAINER_CSS_CLASS + '">';
}

/**
* Generate HTML 'open-tag' of the specified VERTICAL container
**/
function getVerticalOpenTag(containerConfig, dashboardLocalParams) {
	//Calculate Width 
	let width = containerConfig.width;
	if (width == undefined || width < 0) {
		throw new Error("Width is not specified for VERTICAL container (containerConfig = " + JSON.stringify(containerConfig)+ ")");
	}
	let widthParam = widthOrDefault(width, 0);
	return '<div style="' + widthParam + '"  class="' + VERTICAL_CONTAINER_CSS_CLASS + '">';
}

/**
* Return default value if value is not exists
**/
function valueOrDefault(value, defaultValue) {
    return value ? value : defaultValue;
}

/**
* Return default value if value is not exists
**/
function valueOrException(value, defaultValue) {
    return value ? value : defaultValue;
}

/**
* Return default minHeight(in percents) if minHeight is not exists
**/
function minHeightOrDefault(minHeight, defaultminHeight) {
    return 'min-height: ' + valueOrDefault(minHeight, defaultminHeight) + 'px';
}

/**
* Return default width(in percents) if width is not exists
**/
function widthOrDefault(width, defaultWidth) {
    return 'width: ' + valueOrDefault(width, defaultWidth) + '%';
}

/**
* Generate HTML content by container config
**/
function getContainerContent(containerConfig, dashboardLocalParams) {
	//Add HTML content of the container
	let contentHTML = "";
	if (containerConfig.containers) {
		if (containerConfig.widgets) {
			throw new Error("Layout container can't contain widgets and child sub-contaiers at the same time (containerConfig = " + JSON.stringify(containerConfig)+ ")");
		}
		containerConfig.containers.forEach((c) => {
			contentHTML += containerToHtml(c, dashboardLocalParams);
		});
	} else {
		contentHTML += getHtmlForWidgets(containerConfig, dashboardLocalParams);
	}
	return contentHTML;
}


/**
* Retrive inner HTML with widgets for specified container config
**/
function getHtmlForWidgets(containerConfig, dashboardLocalParams) {
	//TODO: Implement
	let widgetsHTML = "";
	if (containerConfig.widgets) {
		containerConfig.widgets.forEach((w) => {
			switch(containerConfig.type) {
				case HORIZONTAL_CONTAINER_TYPE:
					if (dashboardLocalParams.isMobile) {
						widgetsHTML += wrapWidgetInHorizontalBlock(w);
					} else {
						widgetsHTML += wrapWidgetInVerticalBlock(w);
					}
					break;
				case VERTICAL_CONTAINER_TYPE:
					widgetsHTML += wrapWidgetInHorizontalBlock(w);
					break;
				default:
					throw new Error('Unexpected type "' + containerConfig.type + '" of widget parent container  (containerConfig = "' + JSON.stringify(containerConfig) + '")...');
			};		
		});
	}
	return widgetsHTML;
}

/**
* Draw widget and wrap it with horizontal block
**/
function wrapWidgetInHorizontalBlock(widgetConfig) {
	return wrapWidget(widgetConfig, WIDGET_HORIZONTAL_WRAPPER_CSS_CLASS);
}

/**
* Draw widget and wrap it with horizontal block
**/
function wrapWidgetInVerticalBlock(widgetConfig) {
	return wrapWidget(widgetConfig, WIDGET_VERTICAL_WRAPPER_CSS_CLASS);
}

/**
* Draw widget and wrap it with generic div
**/
function wrapWidget(widgetConfig, cssClasses) {
	return '<div class="' + cssClasses + '">' + getWidgetHTML(widgetConfig) + '</div>';
}

/**
* Draw widget
**/
function getWidgetHTML(widgetConfig) {
	//TODO: Implement
	return widgetConfig;
}

/**
* Retrive HTML 'close-tag' for specified container config
**/
function getContainerCloseTag(containerConfig) {
	return "</div>";
}


document.addEventListener('DOMContentLoaded', function(){ 
    let d = document.querySelector("#dashboard");
	let dashboardLocalParams = {
		dashboardWidth: d.clientWidth,
	    dashboardHeight: d.clientHeight,
		isMobile: false
	};
	console.log(dashboardLocalParams);
	let layoutHTML = getContainerContent(dashboardConfig, dashboardLocalParams);
	//Set leyout to dashboard
	d.innerHTML = layoutHTML;
});