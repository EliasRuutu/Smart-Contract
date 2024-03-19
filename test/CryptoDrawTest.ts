import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, MinInt256, getAccountPath } from "ethers";

describe("CryptoDraw Contract Test", function () {
  let cryptoDraw: any;
  let busdt: any;
  let owner: any;
  let user: any;
  let user1: any;
  let user2: any;
  let user3: any;
  let user4: any;
  let user5: any;
  let user6: any;
  let user7: any;
  let user8: any;
  let user9: any;
  let user11: any;
  let user12: any;
  let user13: any;
  let user14: any;

  beforeEach("should deploy smart contract==============:", async function () {
    [
      owner,
      user,
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user11,
      user12,
      user13,
      user14,
    ] = await ethers.getSigners();

    // Deploy CryptoDraw and RandomNumberGenerator contracts
    const CryptoDraw = await ethers.getContractFactory(
      "VRFv2DirectFundingConsumer"
    );
    const BEP20USDT = await ethers.getContractFactory("BEP20USDT");

    const boxNum: bigint = 5n;
    const boxPrice: bigint = ethers.parseEther("0.1");

    busdt = await BEP20USDT.deploy();
    const _busdtAddress = await busdt.getAddress();
    console.log("\tBUSDT address ", _busdtAddress);

    // Deploy the CryptoDraw contract with the RandomNumberGenerator address
    cryptoDraw = await CryptoDraw.deploy(_busdtAddress);
    console.log(
      "\tCryptoDraw Contract address ",
      await cryptoDraw.getAddress()
    );
  });

  it("deployment", async function () {
    // --------------------create a new lottery--------------------------
    const boxNum: bigint = 50n;
    const userBoxNum: bigint = 10n;
    const displayAdd: bigint = 1n;
    const boxPrice: bigint = 100;
    let newLottery = await cryptoDraw.createNewLottery(boxNum, boxPrice);
    let newLotteryId = await cryptoDraw.currentLotteryId();
    console.log("Create a new Lottery\t");
    console.log(
      "\tNew Lottery ID--------------------------------->\t",
      newLotteryId
    );
    console.log(await cryptoDraw.lotteryInfo(newLotteryId));
    // await cryptoDraw.generateBallot(
    //   "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    //   newLotteryId,
    //   userBoxNum
    // );

    // =========================Add user=================================

    const addUser1 = await cryptoDraw.addUser(await user1.getAddress(), 4);
    const addUser2 = await cryptoDraw.addUser(await user2.getAddress(), 1);
    const addUser3 = await cryptoDraw.addUser(await user3.getAddress(), 2);
    const addUser4 = await cryptoDraw.addUser(await user4.getAddress(), 2);
    const addUser5 = await cryptoDraw.addUser(await user5.getAddress(), 1);
    const addUser6 = await cryptoDraw.addUser(await user6.getAddress(), 4);
    const addUser7 = await cryptoDraw.addUser(await user7.getAddress(), 6);
    const addUser8 = await cryptoDraw.addUser(await user8.getAddress(), 7);
    const addUser9 = await cryptoDraw.addUser(await user9.getAddress(), 5);

    const lowStandard: bigint = 12n;
    const midStandard: bigint = 15n;
    const highStandard: bigint = 20n;
    const lowStandardPercentage: bigint = 10n;
    const midStandardPercentage: bigint = 20n;
    const highStandardPercentage: bigint = 30n;
    // ========================= Purchasing Boxes========================

    const amount = 2000;
    // Approve CryptoDraw contract to spend tokens on behalf of owner
    await busdt.approve(await cryptoDraw.getAddress(), amount);
    // Get initial balance of CryptoDraw contract
    const firstBalance = await busdt.balanceOf(await owner.getAddress());
    console.log("\tBefore Buy the Boxes:", firstBalance.toString());
    // Transfer tokens from owner to recipient using CryptoDraw contract
    await busdt.transfer(await cryptoDraw.getAddress(), amount);
    await busdt.transfer(await user1.getAddress(), amount);
    await busdt.transfer(await user2.getAddress(), amount);
    await busdt.transfer(await user3.getAddress(), amount);
    await busdt.transfer(await user4.getAddress(), amount);
    await busdt.transfer(await user5.getAddress(), amount);
    await busdt.transfer(await user6.getAddress(), amount);
    await busdt.transfer(await user7.getAddress(), amount);
    await busdt.transfer(await user8.getAddress(), amount);
    await busdt.transfer(await user9.getAddress(), amount);
    // Get updated balance of CryptoDraw contract after transfer
    const secondBalance = await busdt.balanceOf(await cryptoDraw.getAddress());
    const user1Balance = await busdt.balanceOf(await user1.getAddress());
    const user2Balance = await busdt.balanceOf(await user2.getAddress());
    const user3Balance = await busdt.balanceOf(await user3.getAddress());
    const user4Balance = await busdt.balanceOf(await user4.getAddress());
    const user5Balance = await busdt.balanceOf(await user5.getAddress());
    const user6Balance = await busdt.balanceOf(await user6.getAddress());
    const user7Balance = await busdt.balanceOf(await user7.getAddress());
    const user8Balance = await busdt.balanceOf(await user8.getAddress());
    const user9Balance = await busdt.balanceOf(await user9.getAddress());
    console.log(
      "------------------Balance of Contract and Users---------------------"
    );
    console.log("\tAfter Buy the Boxes:", secondBalance.toString());
    console.log("\tUser1's Balance:", user1Balance);
    console.log("\tUser2's Balance:", user2Balance);
    console.log("\tUser3's Balance:", user3Balance);
    console.log("\tUser4's Balance:", user4Balance);
    console.log("\tUser5's Balance:", user5Balance);
    console.log("\tUser6's Balance:", user6Balance);
    console.log("\tUser7's Balance:", user7Balance);
    console.log("\tUser8's Balance:", user8Balance);
    console.log("\tUser9's Balance:", user9Balance);

    const userAmount = 100000;
    // -------------Contract Approve-----------------
    await busdt.approve(await user1.getAddress(), userAmount);
    await busdt.approve(await user2.getAddress(), userAmount);
    await busdt.approve(await user3.getAddress(), userAmount);
    await busdt.approve(await user4.getAddress(), userAmount);
    await busdt.approve(await user5.getAddress(), userAmount);
    await busdt.approve(await user6.getAddress(), userAmount);
    await busdt.approve(await user7.getAddress(), userAmount);
    await busdt.approve(await user8.getAddress(), userAmount);
    await busdt.approve(await user9.getAddress(), userAmount);
    await busdt.approve(await user11.getAddress(), userAmount);
    await busdt.approve(await user12.getAddress(), userAmount);
    await busdt.approve(await user13.getAddress(), userAmount);
    await busdt.approve(await user14.getAddress(), userAmount);

    // -------------User1 Approve-----------------
    await busdt
      .connect(user1)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user1).approve(await user14.getAddress(), userAmount);
    // -------------User2 Approve-----------------
    await busdt
      .connect(user2)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user2).approve(await user14.getAddress(), userAmount);
    // -------------User3 Approve-----------------
    await busdt
      .connect(user3)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user3).approve(await user14.getAddress(), userAmount);
    // -------------User4 Approve-----------------
    await busdt
      .connect(user4)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user4).approve(await user14.getAddress(), userAmount);
    // -------------User5 Approve-----------------
    await busdt
      .connect(user5)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user5).approve(await user14.getAddress(), userAmount);
    // -------------User6 Approve-----------------
    await busdt
      .connect(user6)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user6).approve(await user14.getAddress(), userAmount);
    // -------------User7 Approve-----------------
    await busdt
      .connect(user7)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user7).approve(await user14.getAddress(), userAmount);
    // -------------User8 Approve-----------------
    await busdt
      .connect(user8)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user1.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user9.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user8).approve(await user14.getAddress(), userAmount);
    // -------------User9 Approve-----------------
    await busdt
      .connect(user9)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user2.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user3.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user4.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user5.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user6.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user7.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user8.getAddress(), userAmount);
    await busdt.connect(user9).approve(await user1.getAddress(), userAmount);
     await busdt.connect(user9).approve(await user11.getAddress(), userAmount);
     await busdt.connect(user9).approve(await user12.getAddress(), userAmount);
     await busdt.connect(user9).approve(await user13.getAddress(), userAmount);
     await busdt.connect(user9).approve(await user14.getAddress(), userAmount);
    console.log("------------------------------------------------");
    console.log("-------------------Nuy Box----------------------");
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );

    const user1PurchaseBox = await cryptoDraw.buyBox(
      await user1.getAddress(),
      10
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );

    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user2PurchaseBox = await cryptoDraw.buyBox(
      await user2.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );

    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user3PurchaseBox = await cryptoDraw.buyBox(
      await user3.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user4PurchaseBox = await cryptoDraw.buyBox(
      await user4.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user5PurchaseBox = await cryptoDraw.buyBox(
      await user5.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user6PurchaseBox = await cryptoDraw.buyBox(
      await user6.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user7PurchaseBox = await cryptoDraw.buyBox(
      await user7.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user8PurchaseBox = await cryptoDraw.buyBox(
      await user8.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    const user9PurchaseBox = await cryptoDraw.buyBox(
      await user9.getAddress(),
      5
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log("------------------------------------------------");

    // =========================Get Users' Information===================

    const user1Info = await cryptoDraw.getUserById(1);
    const user2Info = await cryptoDraw.getUserById(2);
    const user3Info = await cryptoDraw.getUserById(3);
    const user4Info = await cryptoDraw.getUserById(4);
    const user5Info = await cryptoDraw.getUserById(5);
    const user6Info = await cryptoDraw.getUserById(6);
    const user7Info = await cryptoDraw.getUserById(7);
    const user8Info = await cryptoDraw.getUserById(8);
    const user9Info = await cryptoDraw.getUserById(9);

    let userList = await cryptoDraw.getUserAddresses();
    console.log("---------------------User List----------------");
    console.log("\tUser Address List:", userList);
    console.log("------------------------------------------------");
    console.log("-------------------Each User Information--------------------");
    console.log("\tUser1 Information:", user1Info);
    console.log(
      "\tBalance of User1:",
      await busdt.balanceOf(await user1.getAddress())
    );

    console.log(
      "\tBalance of Contract after User1:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );

    console.log("\tUser2 Information:", user2Info);
    console.log(
      "\tBalance of User2:",
      await busdt.balanceOf(await user2.getAddress())
    );

    console.log("\tUser3 Information:", user3Info);
    console.log(
      "\tBalance of User3:",
      await busdt.balanceOf(await user3.getAddress())
    );

    console.log("\tUser4 Information:", user4Info);
    console.log(
      "\tBalance of User4:",
      await busdt.balanceOf(await user4.getAddress())
    );

    console.log("\tUser5 Information:", user5Info);
    console.log(
      "\tBalance of User5:",
      await busdt.balanceOf(await user5.getAddress())
    );

    console.log("\tUser6 Information:", user6Info);
    console.log(
      "\tBalance of User6:",
      await busdt.balanceOf(await user6.getAddress())
    );

    console.log("\tUser7 Information:", user7Info);
    console.log(
      "\tBalance of User7:",
      await busdt.balanceOf(await user7.getAddress())
    );

    console.log("\tUser8 Information:", user8Info);
    console.log(
      "\tBalance of User8:",
      await busdt.balanceOf(await user8.getAddress())
    );

    console.log("\tUser9 Information:", user9Info);
    console.log(
      "\tBalance of User9:",
      await busdt.balanceOf(await user9.getAddress())
    );

    console.log("------------------------------------------------");

    // ================ Get Recommended Numbers of each users==============

    let recommendNumberArray = await cryptoDraw.getRecommendedNumbers();
    console.log(
      "\nAll User Recommend Numbers==========> ",
      recommendNumberArray
    );
    console.log("------------------------------------------------");

    // ================ Get Id of Max Recommended User==============

    let recommendMaxNumber = await cryptoDraw.getMaxRecommendedNumber();
    console.log(
      "\nId of a User who get the Maximum Recommended Number==========> ",
      recommendMaxNumber + displayAdd
    );
    console.log("------------------------------------------------");

    const recommendPercentage: bigint = 10n;
    console.log(
      "\tBalance of User1=========>",
      await busdt.balanceOf(await user1.getAddress())
    );
    await cryptoDraw.payMaxRecommendedUser(recommendPercentage);
    console.log(
      "\tBalance of Max Recommended User========>",
      await busdt.balanceOf(await user1.getAddress())
    );
    // ================ Get Max Number of Boxes=============================
    console.log("------------------------------------------------");

    let userBoxNumberArray = await cryptoDraw.getMaxBoxNumbers();
    console.log("\nAll User Box Numbers==========> ", userBoxNumberArray);
    console.log("------------------------------------------------");

    // ================ Get Id of Max Box User==============

    let maxBoxesNumber = await cryptoDraw.getMaxBoxNumber();
    console.log(
      "\nId of a User who buyes the Maximum Boxes: ",
      maxBoxesNumber + displayAdd
    );
    console.log("------------------------------------------------");

    // ---------------------Winner Price----------

    const winningNumber: bigint = 50n;
    const winnerPercentage: bigint = 50n; //50 = 50% of the total price.
    const sponsorPercentage: bigint = 10n;
    const secondSponsorPercentage: bigint = 5n;
    console.log("------------------------------------------------");

    console.log(
      "\tBalance of Contract Before Setting Winner========>",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "\tBalance of Winner Before Setting Winner========>",
      await busdt.balanceOf(await user1.getAddress())
    );
    // console.log(
    //   "\tBalance of Winner's Sponsor Before Setting Winner========>",
    //   await busdt.balanceOf(await user4.getAddress())
    // );
    // console.log(
    //   "\tBalance of Winner's Second Sponsor Before Setting Winner========>",
    //   await busdt.balanceOf(await user2.getAddress())
    // );

    await cryptoDraw.setWinningUser(winningNumber);
    let winnerUserId = await cryptoDraw.getWinnderUserID();
    console.log("------------------------------------------");
    console.log("\tWinner User Id:", winnerUserId);
    console.log("------------------------------------------");
    console.log(
      "-------------------Each User Information Before Dispersal--------------------"
    );
    console.log(
      "\tBalance of User1:",
      await busdt.balanceOf(await user1.getAddress())
    );

    console.log(
      "\tBalance of User2:",
      await busdt.balanceOf(await user2.getAddress())
    );

    console.log(
      "\tBalance of User3:",
      await busdt.balanceOf(await user3.getAddress())
    );

    console.log(
      "\tBalance of User4:",
      await busdt.balanceOf(await user4.getAddress())
    );

    console.log(
      "\tBalance of User5:",
      await busdt.balanceOf(await user5.getAddress())
    );

    console.log(
      "\tBalance of User6:",
      await busdt.balanceOf(await user6.getAddress())
    );

    console.log(
      "\tBalance of User7:",
      await busdt.balanceOf(await user7.getAddress())
    );

    console.log(
      "\tBalance of User8:",
      await busdt.balanceOf(await user8.getAddress())
    );

    console.log(
      "\tBalance of User9:",
      await busdt.balanceOf(await user9.getAddress())
    );

    console.log(
      "\tBalance of Contract before Incentive:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    await cryptoDraw.userDispersal(
      lowStandard,
      midStandard,
      highStandard,
      lowStandardPercentage,
      midStandardPercentage,
      highStandardPercentage
    );
    console.log("\tNew User Amount:", await cryptoDraw.getNewUserAmount());
    console.log("------------------------------------------");
    console.log(
      "\tBalance of Contract after Dispersal========>",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log("------------------------------------------");
    console.log(
      "-------------------Each User Information After Dispersal--------------------"
    );
    console.log(
      "\tBalance of User1:",
      await busdt.balanceOf(await user1.getAddress())
    );

    console.log(
      "\tBalance of User2:",
      await busdt.balanceOf(await user2.getAddress())
    );

    console.log(
      "\tBalance of User3:",
      await busdt.balanceOf(await user3.getAddress())
    );

    console.log(
      "\tBalance of User4:",
      await busdt.balanceOf(await user4.getAddress())
    );

    console.log(
      "\tBalance of User5:",
      await busdt.balanceOf(await user5.getAddress())
    );

    console.log(
      "\tBalance of User6:",
      await busdt.balanceOf(await user6.getAddress())
    );

    console.log(
      "\tBalance of User7:",
      await busdt.balanceOf(await user7.getAddress())
    );

    console.log(
      "\tBalance of User8:",
      await busdt.balanceOf(await user8.getAddress())
    );

    console.log(
      "\tBalance of User9:",
      await busdt.balanceOf(await user9.getAddress())
    );

    console.log(
      "\tBalance of Contract after Incentive:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );

    console.log("------------------------------------------------");

    const winnerSponsorId = await cryptoDraw.getWinnerSponsorId();
    const winnerSponsorAddress = await cryptoDraw.getWinnderPayAddress();
    // const user2SponsorId = await cryptoDraw.getPaySponsorId();
    // const user2SponsorAddress = await cryptoDraw.getPayAddress();
    // const user3SponsorId = await cryptoDraw.getPaySponsorId();
    // const user3SponsorAddress = await cryptoDraw.getPayAddress();
    // const user4SponsorId = await cryptoDraw.getPaySponsorId();
    // const user4SponsorAddress = await cryptoDraw.getPayAddress();
    // const user5SponsorId = await cryptoDraw.getPaySponsorId();
    // const user5SponsorAddress = await cryptoDraw.getPayAddress();
    // const user6SponsorId = await cryptoDraw.getPaySponsorId();
    // const user6SponsorAddress = await cryptoDraw.getPayAddress();
    // const user7SponsorId = await cryptoDraw.getPaySponsorId();
    // const user7SponsorAddress = await cryptoDraw.getPayAddress();
    // const user8SponsorId = await cryptoDraw.getPaySponsorId();
    // const user8SponsorAddress = await cryptoDraw.getPayAddress();
    // const user9SponsorId = await cryptoDraw.getPaySponsorId();
    // const user9SponsorAddress = await cryptoDraw.getPayAddress();

    console.log(
      "\tUser1 SponsorId and Second SponsorId:",
      await cryptoDraw.getWinnerSponsorId()
    );
    console.log(
      "\tUser1 Sponsor and Second Sponsor Addresses:",
      await cryptoDraw.getWinnderPayAddress()
    );
    // console.log(
    //   "\tUser2 SponsorId and Second SponsorId:",
    //   user2SponsorId
    // );
    // console.log(
    //   "\tUser2 Sponsor and Second Sponsor Addresses:",
    //   user2SponsorAddress
    // );
    // console.log(
    //   "\tUser3 SponsorId and Second SponsorId:",
    //   user3SponsorId
    // );
    // console.log(
    //   "\tUser3 Sponsor and Second Sponsor Addresses:",
    //   user3SponsorAddress
    // );
    // console.log(
    //   "\tUser4 SponsorId and Second SponsorId:",
    //   user4SponsorId
    // );
    // console.log(
    //   "\tUser4 Sponsor and Second Sponsor Addresses:",
    //   user4SponsorAddress
    // );
    // console.log(
    //   "\tUser5 SponsorId and Second SponsorId:",
    //   user5SponsorId
    // );
    // console.log(
    //   "\tUser5 Sponsor and Second Sponsor Addresses:",
    //   user5SponsorAddress
    // );
    // console.log(
    //   "\tUser6 SponsorId and Second SponsorId:",
    //   user6SponsorId
    // );
    // console.log(
    //   "\tUser6 Sponsor and Second Sponsor Addresses:",
    //   user6SponsorAddress
    // );
    // console.log(
    //   "\tUser7 SponsorId and Second SponsorId:",
    //   user7SponsorId
    // );
    // console.log(
    //   "\tUser7 Sponsor and Second Sponsor Addresses:",
    //   user7SponsorAddress
    // );
    // console.log(
    //   "\tUser8 SponsorId and Second SponsorId:",
    //   user8SponsorId
    // );
    // console.log(
    //   "\tUser8 Sponsor and Second Sponsor Addresses:",
    //   user8SponsorAddress
    // );
    // console.log(
    //   "\tUser9 SponsorId and Second SponsorId:",
    //   user9SponsorId
    // );
    // console.log(
    //   "\tUser9 Sponsor and Second Sponsor Addresses:",
    //   user9SponsorAddress
    // );
    console.log("--------------------Pay Winner----------------------");

    await cryptoDraw.payWinner(
      winnerPercentage,
      sponsorPercentage,
      secondSponsorPercentage
    );

    // console.log("\tWinning User Id===========>", winnerUserId);
    console.log(
      "\tBalance of Contract After Setting Winner========>",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    if (winnerUserId == 1) {
      console.log(
        "\tBalance of Winner After Setting Winner==User1:",
        await busdt.balanceOf(await user1.getAddress())
      );
    } else if (winnerUserId == 2) {
      console.log(
        "\tBalance of Winner After Setting Winner==User2:",
        await busdt.balanceOf(await user2.getAddress())
      );
    } else if (winnerUserId == 3) {
      console.log(
        "\tBalance of Winner After Setting Winner==User3:",
        await busdt.balanceOf(await user3.getAddress())
      );
    } else if (winnerUserId == 5) {
      console.log(
        "\tBalance of Winner After Setting Winner==User5:",
        await busdt.balanceOf(await user5.getAddress())
      );
    } else if (winnerUserId == 6) {
      console.log(
        "\tBalance of Winner After Setting Winner==User6:",
        await busdt.balanceOf(await user6.getAddress())
      );
    } else if (winnerUserId == 7) {
      console.log(
        "\tBalance of Winner After Setting Winner==User7:",
        await busdt.balanceOf(await user7.getAddress())
      );
    } else if (winnerUserId == 8) {
      console.log(
        "\tBalance of Winner After Setting Winner==User8:",
        await busdt.balanceOf(await user8.getAddress())
      );
    } else if (winnerUserId == 9) {
      console.log(
        "\tBalance of Winner After Setting Winner==User9:",
        await busdt.balanceOf(await user9.getAddress())
      );
    }
    // console.log("]]]]]]]]]]]]]]]]]]", winnerUser);

    console.log("--------------------------------------------");
    console.log(
      "-------------------Each User Information After Setting Winner--------------------"
    );
    console.log(
      "\tBalance of User1:",
      await busdt.balanceOf(await user1.getAddress())
    );

    console.log(
      "\tBalance of User2:",
      await busdt.balanceOf(await user2.getAddress())
    );

    console.log(
      "\tBalance of User3:",
      await busdt.balanceOf(await user3.getAddress())
    );

    console.log(
      "\tBalance of User4:",
      await busdt.balanceOf(await user4.getAddress())
    );

    console.log(
      "\tBalance of User5:",
      await busdt.balanceOf(await user5.getAddress())
    );

    console.log(
      "\tBalance of User6:",
      await busdt.balanceOf(await user6.getAddress())
    );

    console.log(
      "\tBalance of User7:",
      await busdt.balanceOf(await user7.getAddress())
    );

    console.log(
      "\tBalance of User8:",
      await busdt.balanceOf(await user8.getAddress())
    );

    console.log(
      "\tBalance of User9:",
      await busdt.balanceOf(await user9.getAddress())
    );

    console.log(
      "\tBalance of Contract after Incentive:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );

    console.log("------------------------------------------------");

    // ================ Withdraw Function============
    console.log(
      "\tBalance of Contract before Withdraw",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "\tBalance of Owner before Withdraw",
      await busdt.balanceOf(await owner.getAddress())
    );
    await cryptoDraw.connect(owner).withdrawBUSDT();
    console.log(
      "\tBalance of Contract after Withdraw",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "\tBalance of Owner after Withdraw",
      await busdt.balanceOf(await owner.getAddress())
    );

    console.log("----------------------NEW LOTTERY---------------------");
    await cryptoDraw.reset();
    const boxNum1: bigint = 100n;
    const userBoxNum1: bigint = 10n;
    const displayAdd1: bigint = 1n;
    const boxPrice1: bigint = 100;
    let newLottery1 = await cryptoDraw.createNewLottery(boxNum1, boxPrice1);
    let newLotteryId1 = await cryptoDraw.currentLotteryId();
    console.log("New Lottery After Reset:", newLotteryId1);
    console.log(
      "\tBalance of Contract in New Lottery:",
      await busdt.balanceOf(cryptoDraw.getAddress())
    );

    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    console.log(
      "\tRest User Id in the Past Lottery:",
      await cryptoDraw.getRestId()
    );
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(
      "\tRest User Amount in the Past Lottery:",
      await cryptoDraw.getRestAmount()
    );
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    const addUser11 = await cryptoDraw.addUser(await user11.getAddress(), 4);
     console.log(
       "\tRest User Id in the Past Lottery:",
       await cryptoDraw.getRestId()
     );
     console.log(
       "\tRest User Amount in the Past Lottery:",
       await cryptoDraw.getRestAmount()
     );
    console.log("-----------------------------------");
    const addUser12 = await cryptoDraw.addUser(await user12.getAddress(), 1);
     console.log(
       "\tRest User Id in the Past Lottery:",
       await cryptoDraw.getRestId()
     );
     console.log(
       "\tRest User Amount in the Past Lottery:",
       await cryptoDraw.getRestAmount()
     );
    console.log("************************************");
    const addUser13 = await cryptoDraw.addUser(await user13.getAddress(), 4);
    console.log("//////////////////////////////////////");
    console.log(
      "\tRest User Id in the Past Lottery:",
      await cryptoDraw.getRestId()
    );
    console.log(
      "\tRest User Amount in the Past Lottery:",
      await cryptoDraw.getRestAmount()
    );
    const addUser14 = await cryptoDraw.addUser(await user14.getAddress(), 1);
    console.log("======================================");
    
    const newAmount = 3000;
    // Approve CryptoDraw contract to spend tokens on behalf of owner
    await busdt.approve(await cryptoDraw.getAddress(), newAmount);
    // Get initial balance of CryptoDraw contract
    const newFirstBalance = await busdt.balanceOf(await owner.getAddress());
    console.log("\tBefore Buy the Boxes:", newFirstBalance.toString());
    // Transfer tokens from owner to recipient using CryptoDraw contract
    // await busdt.transfer(await cryptoDraw.getAddress(), newAmount);
    await busdt.transfer(await user11.getAddress(), newAmount);
    await busdt.transfer(await user12.getAddress(), newAmount);
    await busdt.transfer(await user13.getAddress(), newAmount);
    await busdt.transfer(await user14.getAddress(), newAmount);
    const newSecondBalance = await busdt.balanceOf(
      await cryptoDraw.getAddress()
    );
    const user11Balance = await busdt.balanceOf(await user11.getAddress());
    const user12Balance = await busdt.balanceOf(await user12.getAddress());
    const user13Balance = await busdt.balanceOf(await user13.getAddress());
    const user14Balance = await busdt.balanceOf(await user14.getAddress());

    console.log(
      "------------------Balance of Contract and Users---------------------"
    );
    console.log("\tAfter Buy the Boxes:", newSecondBalance.toString());
    console.log("\tUser11's Balance:", user11Balance);
    console.log("\tUser12's Balance:", user12Balance);
    console.log("\tUser13's Balance:", user13Balance);
    console.log("\tUser14's Balance:", user14Balance);
    // -------------Contract Approve-----------------
    await busdt.approve(await user11.getAddress(), userAmount);
    await busdt.approve(await user12.getAddress(), userAmount);
    await busdt.approve(await user13.getAddress(), userAmount);
    await busdt.approve(await user14.getAddress(), userAmount);

    // -------------User1 Approve-----------------
    await busdt
      .connect(user11)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user11).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user11).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user11).approve(await user14.getAddress(), userAmount);
    // -------------User12 Approve-----------------
    await busdt
      .connect(user12)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user12).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user12).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user12).approve(await user14.getAddress(), userAmount);
    // -------------User1 Approve-----------------
    await busdt
      .connect(user13)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user13).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user13).approve(await user11.getAddress(), userAmount);
    await busdt.connect(user13).approve(await user14.getAddress(), userAmount);
    // -------------User1 Approve-----------------
    await busdt
      .connect(user14)
      .approve(await cryptoDraw.getAddress(), userAmount);
    await busdt.connect(user14).approve(await user12.getAddress(), userAmount);
    await busdt.connect(user14).approve(await user13.getAddress(), userAmount);
    await busdt.connect(user14).approve(await user11.getAddress(), userAmount);
    console.log(
      "Balance of Contract before buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of User11 before buybox:",
      await busdt.balanceOf(await user11.getAddress())
    );

    const user11PurchaseBox = await cryptoDraw.buyBox(
      await user11.getAddress(),
      10
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of User11 after buybox:",
      await busdt.balanceOf(await user11.getAddress())
    );
    // console.log(
    //   "Balance of Contract before buybox:",
    //   await busdt.balanceOf(await cryptoDraw.getAddress())
    // );
    // console.log(
    //   "Balance of User11 before buybox:",
    //   await busdt.balanceOf(await user11.getAddress())
    // );
    console.log("---------------------------------------------");

    const user12PurchaseBox = await cryptoDraw.buyBox(
      await user12.getAddress(),
      20
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of User12 after buybox:",
      await busdt.balanceOf(await user12.getAddress())
    );
    // console.log(
    //   "Balance of Contract before buybox:",
    //   await busdt.balanceOf(await cryptoDraw.getAddress())
    // );
    // console.log(
    //   "Balance of User12 before buybox:",
    //   await busdt.balanceOf(await user11.getAddress())
    // );
    console.log("---------------------------------------------");
    const user13PurchaseBox = await cryptoDraw.buyBox(
      await user13.getAddress(),
      25
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of User13 after buybox:",
      await busdt.balanceOf(await user13.getAddress())
    );
    // console.log(
    //   "Balance of Contract before buybox:",
    //   await busdt.balanceOf(await cryptoDraw.getAddress())
    // );
    // console.log(
    //   "Balance of User13 before buybox:",
    //   await busdt.balanceOf(await user13.getAddress())
    // );
    console.log("---------------------------------------------");
    const user14PurchaseBox = await cryptoDraw.buyBox(
      await user14.getAddress(),
      25
    );
    console.log(
      "Balance of Contract after buybox:",
      await busdt.balanceOf(await cryptoDraw.getAddress())
    );
    console.log(
      "Balance of User14 after buybox:",
      await busdt.balanceOf(await user14.getAddress())
    );
    const user11Info = await cryptoDraw.getUserById(10);
    const user12Info = await cryptoDraw.getUserById(11);
    const user13Info = await cryptoDraw.getUserById(12);
    const user14Info = await cryptoDraw.getUserById(13);
    console.log(
      "-------------------Each User Information in New Lottery--------------------"
    );
    console.log("\tUser10 Information:", user11Info);
    console.log("\tUser11 Information:", user12Info);
    console.log("\tUser12 Information:", user13Info);
    console.log("\tUser13 Information:", user14Info);
  });
});
