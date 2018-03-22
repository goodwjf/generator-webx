import $ from 'Zepto'
import { escape } from 'utils/escape.js'

import videoTemplate from 'component/page-video'

var data = {
    "gid": 36975768,
    "title": "视频视频视频视频",
    "sourceid": 36975768,
    "sourceurl": "http://m.miaopai.com/show/channel/HHB8~gH3qprMX7erkX0UWLNfu7KGpxH7dmVzOw__",
    "publish_time": 1520599511,
    "url": "http://gslb.miaopai.com/stream/HHB8~gH3qprMX7erkX0UWLNfu7KGpxH7dmVzOw__.mp4",
    "source": "BLACKPINK吧官博",
    "surl": "http://m.miaopai.com/show/channel/HHB8~gH3qprMX7erkX0UWLNfu7KGpxH7dmVzOw__",
    "news_info": {
        "seed_id": 16075,
        "category": [
            "OTHER"
        ]
    },
    "similar_style": "style3",
    "source_url": "http://m.miaopai.com/show/channel/HHB8~gH3qprMX7erkX0UWLNfu7KGpxH7dmVzOw__",
    "image_info": [
        {
            "url": "http://img02.sogoucdn.com/app/a/200789/446269090abe452e324156754e88d5af",
            "width": 640,
            "size": 138629,
            "type": "jpg",
            "height": 360,
            "name": "http://img01.sogoucdn.com/v2/thumb/resize/w/500/t/1/retype/ext/auto/q/90/?appid=200789&url=http%3A%2F%2Fimg02.sogoucdn.com%2Fapp%2Fa%2F200789%2F446269090abe452e324156754e88d5af"
        }
    ],
    "video_url": "http://toutiao.sogoucdn.com/ykvideo/20180310/f3487eb1f0a77660528c89f3e6460e8d.mp4",
    "visit": "31.38万",
    "type": "video",
    "video_size": 4538467,
    "video_time": "00:38"
}
$(function() {
    function render(data) {
        $('title').text(data.title)
        let html = videoTemplate(data, { escape })
        $('#content').html(html)
    }

    render(data)
})