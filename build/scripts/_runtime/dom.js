import*as r from"./virtual.js";function a(t){t.width<1e3&&(t.format==="desktop"&&(t.FORMAT_SWITCH=1),t.format="mobile"),t.width>1e3&&(t.format==="mobile"&&(t.FORMAT_SWITCH=1),t.format="desktop"),t.width<window.innerHeight&&(t.orientation==="horizontal"&&(t.ORIENTATION_SWITCH=1),t.orientation="vertical"),t.width>window.innerHeight&&(t.orientation==="vertical"&&(t.ORIENTATION_SWITCH=1),t.orientation="horizontal"),t.format==="desktop"&&(t.width=document.documentElement.clientWidth,t.height=window.innerHeight,t.scroll_y=window.scrollY),t.format==="mobile"&&((t.FORMAT_SWITCH||t.ORIENTATION_SWITCH)&&(t.height=window.innerHeight),t.width=document.documentElement.clientWidth,t.scroll_y=window.scrollY);let n=Object.keys(t._virtual);for(let l=0;l<n.length;l++){let i=t._virtual[l],e=t._real[l];i._auto_w&&(i._w=e.clientWidth),i._auto_h&&(i._h=e.clientHeight)}}function _(t){let n=Object.keys(t._elements);for(let l=0;l<n.length;l++){let i=n[l],e=t._elements[i],o=t._target._elements[i];e.update&&(e._width!==0?o.style.width=e._width+"px":o.style.width="auto",e._height!==0?o.style.height=e._height+"px":o.style.height="auto",o.style.transform="translate("+e._left+"px,"+e._top+"px)",o.style.paddingLeft=e._padding_left+"px",o.style.paddingRight=e._padding_right+"px",o.style.paddingTop=e._padding_top+"px",o.style.paddingBottom=e._padding_bottom+"px",e._font_size!==0&&(o.style.fontSize=e._font_size+"px"),e._font_type!==null&&(o.style.fontFamily=e._font_type),e._visible?o.style.display="initial":o.style.display="none"),e.MOUSE_DOWN=!1,e.MOUSE_UP=!1,e.UPDATE=!1}t.SETUP=0,t.FORMAT_SWITCH=0,t.ORIENTATION_SWITCH=0}export function setup(t){const n={SETUP:!0,FORMAT_SWITCH:!1,ORIENTATION_SWITCH:!1,viewport:null,time:performance.now(),delta:0,root:null,format:"",orientation:"",_virtual:{},_real:{},virtual(l){return l in n._virtual?n._virtual[l]:r.element(t,l)},real(l,i,e){if(l in n._real)return n._real[l];let o=document.createElement(i);o.style.position="absolute",o.style.margin="0px",o.style.padding="0px",o.onmouseover=()=>{e.mouse_hover=!0},o.onmouseleave=()=>{e.mouse_hover=!1},o.onmousedown=()=>{e.mouse_down=!0},o.onmouseup=()=>{e.mouse_up=!0},this._elements[l]=o,n.root.append(o)},element(l,i="div"){let e=e.element(t,l);return n.real(l,i,e),e},collect(){a(n)},update(){_(n)},show(){},hide(){}};return n.root=n.element("root"),document.body.append(n.root),n}
