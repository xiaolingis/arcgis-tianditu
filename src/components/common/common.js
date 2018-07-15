/**
 * Created by WJQ on 2018/5/2 17:53.
 */
import { loadModules } from 'esri-loader';

// 该类主要包含初始化自定义底图,并将底图加载到页面上 ;
class Common {
    constructor() {
        this.serverAddress = [
            'http://t0.tianditu.cn/', // 天地图
            'http://t1.tianditu.cn/',
            'http://t2.tianditu.cn/',
            'http://t3.tianditu.cn/',
            'http://t4.tianditu.cn/',
            'http://t5.tianditu.cn/',
            'http://t6.tianditu.cn/',
            'http://t7.tianditu.cn/',
            'http://webrd01.is.autonavi.com/',// 高德
            'http://webrd02.is.autonavi.com/',
            'http://webrd03.is.autonavi.com/',
            'http://webrd04.is.autonavi.com/',
            'http://localhost:8080/4.8/esri/core/workers/worker.js'
        ];
    }

    // 模块加载地址
    options(url) {
        return {
            url: url || '' // 存在着是用户自定义的地址,为空则从 arcgis 官网加载
        };
    }

    commonLoad(modules) {
        // 如果本地没有API就使用这行,url 为空则默认加载官网API;
        // return loadModules (modules, this.options (''));
        // 如果本地有部署API,则使用这句,根据情况修改自己的地址;
        return loadModules (modules, this.options ('http://localhost:8080/4.8/dojo/dojo.js'));
    }

    _maptype() {
        // 该方法仅适用于天地图,因为天地图是同一个服务器,通过url传参来控制不同的地图;
        return 'vec';
    }

    loadBaseTitle() { // 这个方法用于加载地图,目前测试了天地图,谷歌地图,高德地图,切换不同的url,即可加载不同的底图;
        let self = this;
        this.commonLoad ([
            'esri/layers/BaseTileLayer',
            'esri/request',
            'esri/Color'
        ])
        .then (([
                    BaseTileLayer,
                    esriRequest,
                    Color
                ]) => {
            let TintLayer = BaseTileLayer.createSubclass ({
                properties: {
                    urlTemplate: null,
                    tint: {
                        value: null,
                        type: Color
                    }
                },
                // 通过传入参数 level,row,col 来获得 加载瓦片URL;
                getTileUrl(level, row, col) {
                    // 高德地图
                    return 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
                    // 天地图
                    /*return 'http://t' + col % 8 + '.tianditu.cn/' + self._maptype () + '_c/wmts?' +
                        'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + self._maptype () +
                        '&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=' +
                        level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles';*/
                },
                // 此方法获取指定级别和大小的切片。重写此方法以处理从服务器返回的数据。
                fetchTile(level, row, col) {
                    //调用getTileUrl（）方法为LayerView提供给定级别，行和列的瓦片数据
                    let url = this.getTileUrl (level, row, col);
                    // 通过生成的url 请求瓦片数据
                    // 将 allowImageDataAccess 设置为true 以允许跨域访问为3D创建WebGL纹理。
                    return esriRequest (url, {
                        responseType: 'image',
                        allowImageDataAccess: true
                    })
                    .then ((response) => {
                        // 当esri请求成功时，从响应数据中获取图像
                        let image = response.data;
                        let width = this.tileInfo.size[0];
                        let height = this.tileInfo.size[0];
                        // 创建一个 canvas ;
                        let canvas = document.createElement ('canvas');
                        let context = canvas.getContext ('2d');
                        canvas.width = width;
                        canvas.height = height;
                        // 将混合的图像绘制到 canvas 上
                        context.drawImage (image, 0, 0, width, height);
                        return canvas;
                    });
                }
            });
            this.stamenTileLayer = new TintLayer ({
                // urlTemplate: 'http://www.google.cn/maps/vt/lyrs=m@112&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
                tint: new Color ('#004FBB'),
                title: '天地图'
            });
            this.init ();
        });
    }

    init() {
        this.requestConfig (); // 请求跨域问题解决,将url push 到对应的对象即可;
        this.commonLoad (
            ['esri/Map', 'esri/views/MapView', 'esri/config'],
            this.options ('')
        )
        .then (([Map]) => {
            let map = new Map ({
                layers: [this.stamenTileLayer]
            });
            this.webmap = map;
            this.initMapView ();
        })
        .catch (err => {
            console.error (err);
        });
    }

    initMapView() {
        this.commonLoad (['esri/views/MapView', 'esri/geometry/Point'])
        .then (([MapView, Point]) => {
            let view = new MapView ({
                map: this.webmap,
                container: 'viewDiv',
                zoom: 6,
            });
            view.when (() => {
                let pt = new Point ({
                    latitude: 49,
                    longitude: -126
                });
// go to the given point
                view.goTo (pt);
            });
        }, reason => {
            console.error (reason);
        });
    }

    requestConfig() {
        this.commonLoad (['esri/config'])
        .then (([esriConfig]) => {
            let servers = esriConfig.request.corsEnabledServers;
            servers = servers.concat (this.serverAddress);
            esriConfig.request.corsEnabledServers = servers;
        }, reason => {
            console.error (reason);
        });
    }
}

export default Common;
