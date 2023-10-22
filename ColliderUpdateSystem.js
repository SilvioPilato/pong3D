export class ColliderUpdateSystem {
    colliders =  null;
    threeObjs = null;
    constructor(colliders, threeObjs) {
        this.colliders = colliders;
        this.threeObjs = threeObjs;
    }

    execute() {
        for (let [tag, collider] of this.colliders) {
            let threeObj = this.threeObjs.get(tag);
            if (!threeObj) continue;
            collider.copy( threeObj.geometry.boundingBox ).applyMatrix4( threeObj.matrixWorld );
        }
    }
}