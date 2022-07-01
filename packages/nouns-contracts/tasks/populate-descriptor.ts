import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { chunkArray } from '../utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptor` contract address',
    '0xA1a7F17678c134E66F82EfC27B8F7152B67778e6',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptor` contract address',
    '0xF824883111784F179684d904EDE09FC6b5322d25',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers }) => {
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

    console.log('Descriptor address = ', descriptorContract.address);

    // Chunk head and accessory population due to high gas usage
    // console.log(await descriptorContract.addManyBackgrounds(bgcolors));
    // console.log(await descriptorContract.addManyColorsToPalette(0, palette));
    // console.log(await descriptorContract.addManyBodies(bodies.map(({ data }) => data)));

    // const accessoryChunk = chunkArray(accessories, 10);
    // for (const chunk of accessoryChunk) {
    //   console.log(await descriptorContract.addManyAccessories(chunk.map(({ data }) => data)));
    // }

    // const headChunk = chunkArray(heads, 10);
    // for (const chunk of headChunk) {
    //   console.log(await descriptorContract.addManyHeads(chunk.map(({ data }) => data)));
    // }

    console.log(await descriptorContract.addManyGlasses(glasses.map(({ data }) => data)));

    console.log('Descriptor populated with palettes and parts.');
  });
