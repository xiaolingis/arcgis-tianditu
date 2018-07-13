/**
 * Created by WJQ on 2018/5/2 17:53.
 */
import { loadModules } from 'esri-loader';

// 该类主要包含初始化自定义底图,并将底图加载到页面上 ;
class Common {
    constructor () {
        this.serverAddress = [
            'http://t0.tianditu.cn/',
            'http://t1.tianditu.cn/',
            'http://t2.tianditu.cn/',
            'http://t3.tianditu.cn/',
            'http://t4.tianditu.cn/',
            'http://t5.tianditu.cn/',
            'http://t6.tianditu.cn/',
            'http://t7.tianditu.cn/',
        ];
    }

    // 模块加载地址
    options (url) {
        return {
            url: url || '' // 存在着是用户自定义的地址,为空则从 arcgis 官网加载
        };
    }

    commonLoad (modules, options) {
        return loadModules (modules, options);
    }

    _maptype () {
        return 'vec';
    }

    loadBaseTitle () {
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

                // generate the tile url for a given level, row and column
                getTileUrl: function (level, row, col) {
                    return 'http://t' + col % 8 + '.tianditu.cn/' + self._maptype () + '_c/wmts?' +
                        'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + self._maptype () +
                        '&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=' +
                        level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles';
                    // return this.urlTemplate.replace ('{z}', level).replace ('{x}', col).replace ('{y}', row);
                },

                // This method fetches tiles for the specified level and size.
                // Override this method to process the data returned from the server.
                fetchTile: function (level, row, col) {

                    // call getTileUrl() method to construct the URL to tiles
                    // for a given level, row and col provided by the LayerView
                    let url = this.getTileUrl (level, row, col);

                    // request for tiles based on the generated url
                    // set allowImageDataAccess to true to allow
                    // cross-domain access to create WebGL textures for 3D.
                    return esriRequest (url, {
                        responseType: 'image',
                        allowImageDataAccess: true
                    })
                    .then (function (response) {
                        // when esri request resolves successfully
                        // get the image from the response
                        let image = response.data;
                        let width = this.tileInfo.size[ 0 ];
                        let height = this.tileInfo.size[ 0 ];

                        // create a canvas with 2D rendering context
                        let canvas = document.createElement ('canvas');
                        let context = canvas.getContext ('2d');
                        canvas.width = width;
                        canvas.height = height;

                        // Draw the blended image onto the canvas.
                        context.drawImage (image, 0, 0, width, height);

                        return canvas;
                    }.bind (this));
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


    init () {
        this.requestConfig ();
        this.commonLoad (
            [ 'esri/Map', 'esri/views/MapView', 'esri/config' ],
            this.options ('')
        )
        .then (([ Map ]) => {
            let map = new Map ({
                layers: [ this.stamenTileLayer ]
            });
            // and we show that map in a container w/ id #viewDiv
            this.webmap = map;
            this.initMapView ();
        })
        .catch (err => {
            // handle any errors
            console.error (err);
        });
    }

    initMapView () {
        this.commonLoad ([ 'esri/views/MapView' ])
        .then (([ MapView ]) => {
            let view = new MapView ({
                map: this.webmap,
                container: 'viewDiv',
                zoom: 3,
            });
        }, reason => {
            console.error (reason);
        });
    }

    requestConfig () {
        this.commonLoad ([ 'esri/config' ])
        .then (([ esriConfig ]) => {
            for ( let val of this.serverAddress ) {
                esriConfig.request.corsEnabledServers.push (val);
            }
        }, reason => {
            console.error (reason);
        });
    }
}

export default Common;
