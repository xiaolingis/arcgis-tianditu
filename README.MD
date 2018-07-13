### arcgis + vue 本地开发环境配置
 * 1 首先用 `vue-cli` 生成项目结构并安装项目依赖,当然,这不是唯一的,同样也可以使用 `iview-cli` 来生成,再次不在赘述.
 * 2 安装 arcgis 官方依赖 `esri-loader `,这个只是开发依赖,因此使用命令 ` npm i esri-loader --save-dev` 来安装.
 * 3 用模块的方式引入 `esri-loader `;
    ```
    import esriLoader from 'esri-loader'
    ```
    > esriLoader 有以下几个方法 : 
    > * 1 getScript () 从库里面获取 js 文件 ;get the script injected by this library
    > * 2 isLoaded () 检测模块是否加载完成 ;
    > * 3 loadModules( [ ], options) 用于加载arcgis 模块,
    > * 4 loadCss( url ) 用于加载css文件
    > * 5 loadScript({url: "xxxxxxxx" }) 将js 加载到页面上,
* 4 开始加载第一个地图:
    ````
    // template 部分代码: 
        <div>
            <div id="viewDiv"></div>
            <div id="newmap"></div>
        </div>
    ````
    ```
     // css 代码 : 
     #viewDiv {
         margin: 20px auto;
         border: 1px solid #000;
         width: 500px;
         height: 400px;
     }

    ```
    ````
    // js 代码
    import esriLoader from 'esri-loader'
    
    const options = {
                // 可以使用自定义资源加载,arcgis 官网加载太慢了,经常加载失败.后面会讲到自己本地如何配置资源
                url: 'http://localhost:8080/arcgis_js_api/library/4.7/init.js'
            }
    
            esriLoader.loadModules ([
                "esri/Map",
                'esri/views/MapView',
            ], options)
            .then (([
                        Map,
                        MapView
                    ]) => {
                const map = new Map ({
                    basemap: "streets"
                })
                const mapview = new MapView ({
                    container: "viewDiv",
                    map: map,
                    zoom: 12,
                    center: [ 102.7346125, 25.0563901 ]
                })
            }, reason => {
                console.log (reason);
            })
    ````
    * 配置好以上部分,就可以正常的加载出地图了.
    
* 5本地配置 arcgis 资源:
    * 5.1 下载资源,官网提供了下载的资源,需要先注册账号才能下载,但是呢,注册账号的有不开发,可以通过谷歌账号登陆,登陆完成就可以下载了.[下载地址](https://developers.arcgis.com/sign-in?redirect_uri=%2Fdownloads%2Fapis-and-sdks%3Fproduct%3Djavascript) 
    * 5.2 windows 系统下配置 ,首先安装 tomcat,进入tomcat 所在目录,将下载下来的文件加压,将`arcgis_js_api`文件夹粘贴到 tomcat 的 webapps 目录下.
    * 5.3 在 `\arcgis_js_api\library\4.7` 目录下 init.js 文件打开, 搜索 `https://[HOSTNAME_AND_PATH_TO_JSAPI]dojo`,替换为 
    `http://localhost:8080/arcgis_js_api/library/4.7/`
    用同样的方式处理 `\arcgis_js_api\library\4.7\dojo\dojo.js`;
    将`https://[HOSTNAME_AND_PATH_TO_JSAPI]dojo`改为`"http://localhost:8080/arcgis_js_api/library/4.7/dojo/"`
    * 5.4 启动 tomcat ;这里注意,我的tomcat 默认端口是 8080, 如果你的不是 8080,请更改替换后连接的端口;然后,打开浏览器,
    输入`http://localhost:8080/arcgis_js_api/library/4.7/init.js`,看看能否正常访问,能访问就在说明正常了.
 


 * 谷歌API key :  `AIzaSyDnp_lrflX125RqZvi4oVpdln0Ykzcmv14`

    ```
        
        http://mt.google.cn/vt/lyrs=s@112&hl=zh-CN&gl=cn  //卫星地图服务
    
        http://mt.google.cn/vt/lyrs=h@177000000&hl=zh-CN&gl=cn    //地区名称矢量地图服务
    
        http://mt.google.cn/vt/lyrs=m@112&hl=zh-CN&gl=cn    //矢量地图服务
        
    ```
