import { Matrix, noise } from '../render/core/cg.js';

async function getFile(file, callback) {
    try {
        const response = await fetch(file);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        callback(await response.text());
    } catch (error) { }
}

let replaceAtSigns = src => {
   let dst = '';
   for (let i = 0 ; i < src.length ; i++)
      if (src[i] == '@')
         dst += 'I[' + src[++i] + ']';
      else
         dst += src[i];
   return dst;
}

export const init = async model => {
   let robot;

   window.I = [0,0,0,0,0, 0,0,0,0,0];
   window.cg = new Matrix();
   cg.draw = (shape, color) => {
      model.add(shape).setMatrix(cg.getValue()).color(color);
      return cg;
   }
   cg.move     = cg.translate;
   cg.pop      = cg.restore;
   cg.push     = cg.save;
   cg.turnX    = cg.rotateX;
   cg.turnY    = cg.rotateY;
   cg.turnZ    = cg.rotateZ;
   window.PI   = Math.PI;
   window.ball = 'sphere';
   window.cube = 'cube';
   window.tube = 'tubeZ';

   model.animate(() => {
      getFile('bici/projects/0423/src/robot.cg', text => robot = text);

      if (robot) {
         let fn = new Function(replaceAtSigns(robot));
         for (let i = 0 ; i < 10 ; i++)
            I[i] = 2 * noise(i + model.time, .5, .5);
         while (model.nChildren() > 0)
            model.remove(0);
         cg.identity().move(0,1.5,0).scale(.5);
         fn();
      }
   });
}
