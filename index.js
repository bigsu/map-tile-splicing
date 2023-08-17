const path = require('path');
const Jimp = require('jimp');

const TILE_WIDTH = 256; // 瓦片宽度
const TILE_HEIGHT = 256; // 瓦片高度
const X = 8; // 列数
const Y = 4; // 行数

const filePath = path.join(__dirname,'tiles/2');

async function createTransparentImage() {
    const image = await new Jimp(TILE_WIDTH, TILE_HEIGHT);
    image.background(0x00000000); // 设置透明背景
    return image;
}

async function main() {
    const mapImage = await new Jimp(X * TILE_WIDTH, Y * TILE_HEIGHT);

    const transparentImage = await createTransparentImage();

    // for (let row = 0; row < NUM_ROWS; row++) {//不反转Y
    for (let row = Y - 1; row >= 0; row--) {//反转Y
        for (let col = 0; col < X; col++) {
            const tilePath = `${filePath}/${col}/${row}.png`;
            try {
                const tileImage = await Jimp.read(tilePath);
                mapImage.blit(tileImage, col * TILE_WIDTH, (Y - 1 - row) * TILE_HEIGHT);
            } catch (error) {
                // 图片不存在，使用透明图填充
                mapImage.blit(transparentImage, col * TILE_WIDTH, (Y - 1 - row) * TILE_HEIGHT);
                console.warn(`Tile not found: ${tilePath}`);
            }
        }
    }

    const outputPath = path.join(__dirname, 'map.png'); // 输出地图路径
    await mapImage.writeAsync(outputPath);

    console.log('Map image saved:', outputPath);
}

main().catch(error => {
    console.error('An error occurred:', error);
});
