const fs = require('fs')
const path = require('path')
const env = require('./src/loadEnv')

const { BRIDGE_MODE, ERC20_TOKEN_ADDRESS } = env

const deployResultsPath = path.join(__dirname, './bridgeDeploymentResults.json')

function writeDeploymentResults(data) {
    fs.writeFileSync(deployResultsPath, JSON.stringify(data, null, 4))
    console.log('Contracts Deployment have been saved to `bridgeDeploymentResults.json`')
}

async function deployNativeToErcc() {
    const preDeploy = require('./src/native_to_erc/preDeploy')
    const deployHome = require('./src/native_to_erc/home')
    const deployForeign = require('./src/native_to_erc/foreign')
    await preDeploy()
    const { homeBridge } = await deployHome()
    //const { foreignBridge, erc677 } = await deployForeign('0x24AE61B4a880573fc190a05A407033DA4cd30434')
    console.log('\nDeployment has been completed.\n\n')
   // console.log(`[   Home  ] HomeBridge: ${homeBridge.address} at block ${homeBridge.deployedBlockNumber}`)
   // console.log(`[ Foreign ] ForeignBridge: ${foreignBridge.address} at block ${foreignBridge.deployedBlockNumber}`)
  //  console.log(`[ Foreign ] ERC677 Bridgeable Token: ${erc677.address}`)
    return


}

async function deployErcToErcc() {
    const preDeploy = require('./src/erc_to_erc/preDeploy')
    const deployHome = require('./src/erc_to_erc/home')
    const deployForeign = require('./src/erc_to_erc/foreign')
    await preDeploy()
    //const { homeBridge, erc677 } = await deployHome()
    const { foreignBridge } = await deployForeign()
    console.log('\nDeployment has been completed.\n\n')
    console.log(`[   Home  ] HomeBridge: ${homeBridge.address} at block ${homeBridge.deployedBlockNumber}`)
    console.log(`[   Home  ] ERC677 Bridgeable Token: ${erc677.address}`)
    console.log(`[ Foreign ] ForeignBridge: ${foreignBridge.address} at block ${foreignBridge.deployedBlockNumber}`)
    console.log(`[ Foreign ] ERC20 Token: ${ERC20_TOKEN_ADDRESS}`)
    writeDeploymentResults({
        homeBridge: {
            ...homeBridge,
            erc677
        },
        foreignBridge: {
            ...foreignBridge
        }
    })
}


async function main() {
    console.log(`Bridge mode: ${BRIDGE_MODE}`)
    switch (BRIDGE_MODE) {
        case 'NATIVE_TO_ERC':
            await deployNativeToErcc()
            break
        case 'ERC_TO_ERC':
            await deployErcToErcc()
            break

        default:
            console.log(BRIDGE_MODE)
            throw new Error('Please specify BRIDGE_MODE: NATIVE_TO_ERC or ERC_TO_ERC')
    }
}

main().catch(e => console.log('Error:', e))
