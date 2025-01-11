import { BALL_RADIUS, COURT_WIDTH, PLAYER_LEN, PLAYER_RADIUS, WALL_HEIGHT } from "../../config";

export function lerp(a, b, t) {
	return a + (b - a) * t;
}

export function getCollider(x, y, width, height) {
    return {
        left: x - (width / 2),
        right: x + (width / 2),
        top: y + (height / 2),
        bottom: y - (height / 2),
    };
}

export function getPlayerCollider(x, y) {
    return getCollider(x, y, PLAYER_RADIUS * 2, PLAYER_LEN)
}

export function getWallCollider(x,y) {
    return getCollider(x,y, COURT_WIDTH, WALL_HEIGHT * 2);
}

export function getBallCollider(x,y) {
    return getCollider(x,y, BALL_RADIUS * 2, BALL_RADIUS * 2);
}

export function AABB(box1, box2) {
    return (box1.left < box2.right) &&
        (box1.right > box2.left) &&
        (box1.top > box2.bottom) &&
        (box1.bottom < box2.top);
}

export function handleResize(camera, renderer) {
    return function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(pixelRatio);
    }
}

