<template>
    <div class="progress-box">
        <canvas type="2d" id="progressCanvas" style="width: 200px; height: 200px;"></canvas>
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { WxJson, WxComponent, WxMethod } from "../../../typings/wx/lib.vue";

interface IComponentData {
    ctx: WechatMiniprogram.CanvasContext
}

@WxJson({
    component: true
})
export class CircleProgress extends WxComponent<IComponentData>  {
    public options = {
        addGlobalClass: true
    }
    
    public properties = {
        progress: Number
    }

    public observers = {
        progress: function(this: CircleProgress, progress: number) {
            this.drawProgress(progress, 100, 100);
        }
    };

    onReady() {
        const query = wx.createSelectorQuery()
        query.select('#progressCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
                const canvas = res[0].node;
                const ctx = canvas.getContext('2d') as WechatMiniprogram.CanvasContext;
                const dpr = wx.getSystemInfoSync().pixelRatio;
                canvas.width = res[0].width * dpr;
                canvas.height = res[0].height * dpr;
                ctx.scale(dpr, dpr);
                this.data.ctx = ctx;
            });
    }

    @WxMethod()
    public drawProgress(progress: number, centerX: number, centerY: number) {
        const ctx = this.data.ctx;
        if (!ctx) {
            return;
        }
	    const deg = (2 * Math.PI / 100 * progress) - 0.5 * Math.PI;
        //圆环的绘制
        ctx.arc(centerX, centerY, centerX - 8, -0.5 * Math.PI, deg); //绘制的动作
        ctx.setStrokeStyle("#ff5000"); //圆环线条的颜色
        ctx.setLineWidth(16);	//圆环的粗细
        ctx.setLineCap("butt");	//圆环结束断点的样式  butt为平直边缘 round为圆形线帽  square为正方形线帽
        ctx.stroke();
        ctx.draw();
    }
}

</script>
<style lang="scss" scoped>

</style>
