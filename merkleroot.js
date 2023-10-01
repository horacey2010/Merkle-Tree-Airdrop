const keccak256 = require("keccak256"); // npm install keccak256
const { MerkleTree } = require("merkletreejs"); // npm install merkletreejs
var WhiteList = artifacts.require("WhiteList")

module.exports = async function(callback) {

    // create merkle root

    const ERC20_ABI = [

        {
            "inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
        }
    ]

    const whitelist = await WhiteList.deployed()
    console.log(`Deployed WhiteList Contract: ${whitelist.address}`)
    console.log("------------------------------------")
    const erc20Contract = new web3.eth.Contract(ERC20_ABI, "0x7E288B66Fd7Dd684c6cA03f5d92295D0a804de4A");
    let balance = await erc20Contract.methods.balanceOf(whitelist.address).call()
    console.log("HAT Balance", balance.toString())
    balance = web3.utils.fromWei(balance.toString())
    console.log("HAT Balance", balance.toString())
    console.log("------------------------------------")

    let balances = [
        {
            addr: "0xcFd8bF3E48a9aEdeba725c296388C05c787aB8af",
            amount: web3.eth.abi.encodeParameter(
            "uint256",
            "1000000000000000000"
            ),
        },
        {
            addr: "0xa681704500b9A8289584594fd8dDA66fD72EcBC7",
            amount: web3.eth.abi.encodeParameter(
            "uint256",
            "2000000000000000000"
            ),
        },
        {
            addr: "0x7B4a6d98d7df8245aD62877756Eb53fbe7d237A8",
            amount: web3.eth.abi.encodeParameter(
            "uint256",
            "3000000000000000000"
            ),
        },
        {
            addr: "0x2Cc92CCBC20644b52D965Ac07BA0c0A0880E67CB",
            amount: web3.eth.abi.encodeParameter(
            "uint256",
            "4000000000000000000"
            ),
        },
        {
            addr: "0x3db84fc31aA66E14379053D041093097C2DB223a",
            amount: web3.eth.abi.encodeParameter(
            "uint256",
            "5000000000000000000"
            ),
        },
    ];

    const leafNodes = balances.map((balance) =>
    keccak256(
        Buffer.concat([
        Buffer.from(balance.addr.replace("0x", ""), "hex"),
        Buffer.from(balance.amount.replace("0x", ""), "hex"),
        ])
    )
    );

    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

    console.log("---------");
    console.log("Merke Tree");
    console.log("---------");
    console.log(merkleTree.toString());
    console.log("---------");
    console.log("Merkle Root: " + merkleTree.getHexRoot());

    console.log("Proof 1: " + merkleTree.getHexProof(leafNodes[0]));
    console.log("Proof 2: " + merkleTree.getHexProof(leafNodes[1]));
    console.log("Proof 3: " + merkleTree.getHexProof(leafNodes[2]));
    console.log("Proof 4: " + merkleTree.getHexProof(leafNodes[3]));
    console.log("Proof 5: " + merkleTree.getHexProof(leafNodes[4]));

    let proof0 = merkleTree.getHexProof(leafNodes[0])
    let proof1 = merkleTree.getHexProof(leafNodes[1])
    let proof2 = merkleTree.getHexProof(leafNodes[2])
    let proof3 = merkleTree.getHexProof(leafNodes[3])
    let proof4 = merkleTree.getHexProof(leafNodes[4])
    
    let amount = web3.utils.toWei("5")
    await whitelist.claim(proof4, amount.toString())

    callback();
}
