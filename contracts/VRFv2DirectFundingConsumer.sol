// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VRFv2DirectFundingConsumer is
    VRFV2WrapperConsumerBase,
    ConfirmedOwner
{
    IERC20 public busdt;
    struct Box {
        uint ballot1;
        uint ballot2;
    }
    struct User {
        address address_;
        uint id;
        uint sponsorId;
        uint secondSponsorId;
        uint boxNum;
        uint[] boxIDs;
        uint recommendNum;
    }
    struct LotteryInfo {
        uint totalBoxNum;
        uint boxPrice;
        uint[] ballots;
    }
    address internal _owner; // Contract Owner
    address[] internal _userList; // All users
    address sponsorAddress;
    address secondSponsorAddress;
    address public winnerSponsorAddress;
    address public winnerSecondSponsorAddress;
    uint internal _boxNum; // Box Number
    uint internal _currentUserId = 0; // Current User ID
    uint[] internal _ballots; // All ballot numbers
    uint[] internal userBoxArray;
    uint[] public restSecondSponsorId;
    uint[] public restSecondSponsorAmount;
    Box[] internal _boxes; // All boxes
    uint256 paySponsorId;
    uint256 paySecondSponsorId;
    uint256 public winningUserID;
    uint256 public requestCounter;
    uint256 internal _boxPrice; // Box Price
    uint public currentLotteryId;
    uint public pastLotterId;
    uint public currentBoxId;
    uint public newUserAmount = 0;
    uint public winnerSponsorId;
    uint public winnerSecondSponsorId;
    
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;
    mapping(uint => bool) public currentLotteryIdToBool;
    mapping(uint => Box) internal _boxIDToBox; // key: Box ID, value: Box
    mapping(address => uint) public _addressToId; // key: User Address, value: User ID
    mapping(uint => User) internal _users; // key: User ID, value: User
    mapping(uint => LotteryInfo) public lotteryInfo; // key: lotteryId, value: LotteryInfo
    mapping(address => uint[]) public userBallots; // key: user address, value: ballots array
    mapping(uint => mapping(uint => bool)) public doesBallotExist; // key: lotteryId, ballot, value: doesBallotExist

    /* --------------------------------- main functions --------------------------------- */

    function createNewLottery(uint boxNum, uint boxPrice) external returns (uint) {
        currentLotteryIdToBool[currentLotteryId] = false;
        currentLotteryId++;
        lotteryInfo[currentLotteryId].totalBoxNum = boxNum;
        lotteryInfo[currentLotteryId].boxPrice = boxPrice;
        _boxPrice = boxPrice;
        return currentLotteryId;
    }

    function getLotteryInfo(uint lotteryId) public view returns (LotteryInfo memory) {
        return lotteryInfo[lotteryId];
    }

    function generateBallot(address user, uint lotteryId, uint boxNum) public {
        uint totalNum = lotteryInfo[lotteryId].totalBoxNum;
        require(totalNum >= boxNum, "Exceeds total Box number");
        uint count = 0;
        for (uint i = totalNum * 10; i > 0; i--) {
            uint j = uint(uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % (totalNum * 2));
            if (!doesBallotExist[lotteryId][j]) {
                lotteryInfo[lotteryId].ballots.push(j);
                userBallots[user].push(j);
                doesBallotExist[lotteryId][j] = true;
                count++;
            }
            if (count == boxNum * 2) break;
        }
    }
 
    function addUser(address user, uint sponsorId) public {
        require(currentLotteryIdToBool[currentLotteryId] == false, "This Lotter is Ended.");
        require(_addressToId[user] == 0, "User already exists");
        if(_currentUserId == 0){
            sponsorId = 0;
        }
        require(sponsorId <= _currentUserId, "Invalid sponsor ID");
        _currentUserId++;
        uint secondSponsorId = _users[sponsorId].sponsorId; // Get sponsor ID of the selected sponsor
        _users[sponsorId].recommendNum++; // Increase recommend number of sponsor
        _addressToId[user] = _currentUserId; // Set current ID for User Address
        _users[_currentUserId].address_ = user;
        _users[_currentUserId].id = _currentUserId;
        _users[_currentUserId].sponsorId = sponsorId;
        _users[_currentUserId].secondSponsorId = secondSponsorId;
        _userList.push(user);
        // -------------------transfer to the user of the new draw
        if(currentLotteryId > pastLotterId && restSecondSponsorId.length > 0){
            for(uint i = 0; i < restSecondSponsorId.length; i++){
                bool success;
                uint amount;
                if(restSecondSponsorId[i] == sponsorId && sponsorId == 1){
                    amount = restSecondSponsorAmount[i];
                    success = busdt.transfer(user, amount);
                    if(success) {
                        removeElement(i, restSecondSponsorId);
                        removeElement(i, restSecondSponsorAmount);
                    }
                }
                else if(restSecondSponsorId[i] == secondSponsorId){
                    amount = restSecondSponsorAmount[i];
                    success = busdt.transfer(user, amount);
                    if(success) {
                        removeElement(i, restSecondSponsorId);
                        removeElement(i, restSecondSponsorAmount);
                    } 
                }else if(restSecondSponsorId[i] == sponsorId){
                    amount = restSecondSponsorAmount[i];
                    success = busdt.transfer(user, amount);
                    if(success) {
                        removeElement(i, restSecondSponsorId);
                        removeElement(i, restSecondSponsorAmount);
                    } 
                }
            }
        }
    }

    function removeElement(uint index, uint[] storage array) internal {
        require(index < array.length, "Index out of bounds");
        array[index] = array[array.length - 1];
        array.pop();
    }

    function buyBox(address user, uint userBoxNum) public payable {
        generateBallot(user, currentLotteryId, userBoxNum);
        uint userId = _addressToId[user]; // Get User ID
        userBoxArray = getUserBallots(user);
        uint256 fee = userBoxNum * _boxPrice;
        bool success = false;
        success = busdt.transferFrom(user, address(this), fee);
        require(success, "Failed to send Box Fee");
        for (uint256 i = 0; i < userBoxNum * 2; i++) {
            _users[userId].boxIDs.push(userBoxArray[i]); // Set Box ID Array to boxIDs array
        }
        uint finalUserBoxNum = _users[userId].boxIDs.length;
        _users[userId].boxNum = finalUserBoxNum/2; // Set Box Number to boxNum
    }
    function userDispersal(uint256 lowStandard, uint256 midStandard, uint256 highStandard, uint256 lowStandardPercentage, uint256 midStandardPercentage, uint256 highStandardPercentage) public payable {
        uint userLength = _userList.length;
        for (uint i = 1; i <= userLength; i++){
            uint eachUserAmount = _users[i].boxNum * _boxPrice;
            uint eachUserBoxNum = _users[i].boxNum;
            address eachUserAddress = _users[i].address_;
            if (eachUserBoxNum >= lowStandard && eachUserBoxNum < midStandard) {
                busdt.transfer(eachUserAddress, (eachUserAmount * lowStandardPercentage)/100);
            }else if (eachUserBoxNum >= midStandard && eachUserBoxNum < highStandard) {
                busdt.transfer(eachUserAddress, (eachUserAmount * midStandardPercentage)/100);
            }else if (eachUserBoxNum >= highStandard) {
                busdt.transfer(eachUserAddress, (eachUserAmount * highStandardPercentage)/100);
            }
            paySponsorId = _users[i].sponsorId;
            paySecondSponsorId = _users[i].secondSponsorId;
            sponsorAddress = _users[paySponsorId].address_;
            secondSponsorAddress = _users[paySecondSponsorId].address_;
            if(paySponsorId == 0 && paySecondSponsorId == 0){
                restSecondSponsorId.push(i);
                restSecondSponsorAmount.push(eachUserAmount/2);
                newUserAmount += eachUserAmount/2;
            }else if(paySecondSponsorId == 0){
                busdt.transfer(sponsorAddress, eachUserAmount / 4);
                restSecondSponsorId.push(i);
                restSecondSponsorAmount.push(eachUserAmount/4);
                newUserAmount += eachUserAmount/4;
            }else if(paySponsorId != 0 && paySecondSponsorId != 0){
                if(_users[paySponsorId].boxNum == 0 && _users[paySecondSponsorId].boxNum == 0){
                    newUserAmount += eachUserAmount/2;
                }else if(_users[paySponsorId].boxNum != 0 && _users[paySecondSponsorId].boxNum == 0){
                    newUserAmount += eachUserAmount/4;
                    busdt.transfer(sponsorAddress, eachUserAmount / 4);
                }else if(_users[paySponsorId].boxNum == 0 && _users[paySecondSponsorId].boxNum != 0){
                    newUserAmount += eachUserAmount/4;
                    busdt.transfer(secondSponsorAddress, eachUserAmount / 4);
                }else{
                    busdt.transfer(sponsorAddress, eachUserAmount / 4);
                    busdt.transfer(secondSponsorAddress, eachUserAmount / 4);
                }
            }
        }
    }

// ------------------return to the user of the new draw=---------------------------
    function getNewUserAmount() public view returns(uint){
        return newUserAmount;
    }

    function getPaySponsorId() external view returns (uint256, uint256){
        return(paySponsorId, paySecondSponsorId);
    }
    function getPayAddress() external view returns (address, address){
        return(sponsorAddress, secondSponsorAddress);
    }
    function getWinnerSponsorId() external view returns (uint256, uint256){
        return(winnerSponsorId, winnerSecondSponsorId);
    }
    function getWinnderPayAddress() external view returns (address, address){
        return(winnerSponsorAddress, winnerSecondSponsorAddress);
    }

    function getBoxNumber() external view returns (uint) {
        return _boxNum;
    }

    function getBoxPrice() external view returns (uint256) {
        return _boxPrice;
    }

    function getTotalBallots() external view returns (uint[] memory) {
        return _ballots;
    }

    function getRestId() external view returns(uint[] memory){
        return restSecondSponsorId;
    }
    
    function getRestAmount() external view returns(uint[] memory){
        return restSecondSponsorAmount;
    }

    function getUserBoxArray() external view returns (uint[] memory) {
        return userBoxArray;
    }

    function getTotalBoxes() external view returns (Box[] memory) {
        return _boxes;
    }

    function getBox(uint id) external view returns (Box memory) {
        require(id <= _boxNum, "Exceeds Box Number.");
        return _boxIDToBox[id];
    }

    function getUserAddresses() external view returns(address[] memory) {
        return _userList;
    }

    function getUserById(uint userId) public view returns (User memory) {
        return _users[userId];
    }

    function getRecommendedNumbers() public view returns (uint[] memory) {
        uint[] memory _recommendedNumbers = new uint[](_userList.length); // Array which stores all recommendedNumber
        for (uint i = 0; i < _userList.length; i++){
            _recommendedNumbers[i] = _users[i + 1].recommendNum;
        }
        return _recommendedNumbers;
    }

    function getMaxBoxNumbers() public view returns (uint[] memory) {
        uint[] memory _BoxNumbers = new uint[](_userList.length); // Array which stores all recommendedNumber
        for (uint i = 0; i < _userList.length; i++){
            _BoxNumbers[i] = _users[i + 1].boxNum;
        }
        return _BoxNumbers;
    }
// ------------------------get the Id of the user who has max number of RecommendUser
    function getMaxRecommendedNumber() public view returns (uint) {
        uint[] memory recommendedNumbers = getRecommendedNumbers();
        uint maxNumber = 0;
        uint index = 0;
        for (uint i = 0; i < recommendedNumbers.length; i++) {
            if (recommendedNumbers[i] > maxNumber) {
                maxNumber = recommendedNumbers[i];
                index = i;  
            }
        }
        return index;
    }

// -----------------------Pay function to the User who has the Maximum boxes-------------

    function payMaxRecommendedUser(uint256 recommendPercentage) public payable{
        uint maxRecommendedUserId = getMaxRecommendedNumber() + 1;
        require(recommendPercentage <= 100, "Invalid Percentage");
        uint incentiveFee = (_users[maxRecommendedUserId].boxNum * _boxPrice * recommendPercentage)/100;
        address maxRecommendUser = _users[maxRecommendedUserId].address_;
        busdt.transfer(maxRecommendUser, incentiveFee);
    }

// -------------------------get the Id of the user who buy max number of Boxes
    function getMaxBoxNumber() public view returns (uint) {
        uint[] memory maxBoxNumbers = getMaxBoxNumbers();
        uint maxBoxNumber = 0;
        uint index = 0;
        for (uint i = 0; i < maxBoxNumbers.length; i++) {
            if (maxBoxNumbers[i] > maxBoxNumber) {
                maxBoxNumber = maxBoxNumbers[i];
                index = i;  
            }
        }
        return index;
    }

    function getUserBallots(address user) public view returns (uint[] memory) {
        return userBallots[user];
    }

    function getLotteryBallots(uint lotteryId) public view returns (uint[] memory) {
        return lotteryInfo[lotteryId].ballots;
    }

    /* --------------------------------- internal functions --------------------------------- */

    function _checkOwner() internal view {
        require(msg.sender == _owner, 'Only owner can call this function');
    }
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

    uint256[] public requestIds;
    uint256 public lastRequestId;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    // Address LINK - hardcoded for Sepolia
    address linkAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    // address WRAPPER - hardcoded for Sepolia
    address wrapperAddress = 0xab18414CD93297B0d12ac29E63Ca20f515b3DB46;

    constructor(address _busdtAddress)
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {_owner = msg.sender;
        busdt = IERC20(_busdtAddress);}

    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        
        // Assuming _randomWords is an array, you may need to process each element individually
        for (uint256 i = 0; i < _randomWords.length; i++) {
            s_requests[_requestId].randomWords.push(_randomWords[i]);
        }

        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    function getWinningNumber(uint256 _requestId, uint lotteryId) public view returns (uint256[] memory) {
        require(s_requests[_requestId].paid > 0, "request not found");
        uint totalBoxes = lotteryInfo[lotteryId].totalBoxNum * 2;
        uint[] memory randomWords = s_requests[_requestId].randomWords;
        for (uint i = 0; i < randomWords.length; i++) {
            randomWords[i] = randomWords[i] % totalBoxes;
        }
        return randomWords;
    }

    function getLastRequestId() public view returns(uint256){
        return lastRequestId;
    }

    // function setWinningUser(uint256 requestId, uint lotteryId) external returns (uint) {
    //     uint256[] memory winningNumber = getWinningNumber(requestId, lotteryId);
    //     for(uint256 i = 0; i < _userList.length; i++){
    //         User memory currentUser = _users[_addressToId[_userList[i]]];
    //         bool foundWinner = false;
    //         for (uint j = 0; j < currentUser.boxIDs.length; j++) {
    //             for (uint k = 0; k < winningNumber.length; k++) {
    //                 if(currentUser.boxIDs[j] == winningNumber[k]){
    //                     foundWinner = true;
    //                     break;
    //                 }
    //             }
    //             if(foundWinner){
    //                 winningUserID = currentUser.id;
    //                 break;
    //             }
    //         }
    //         if(foundWinner){
    //             break;
    //         }
    //     }
    //     return winningUserID;
    // }

    function setWinningUser(uint setWinningNumber) external returns (uint) {
        // uint256[] memory winningNumber = setWinningNumber;
        for(uint256 i = 0; i < _userList.length; i++){
            User memory currentUser = _users[_addressToId[_userList[i]]];
            for (uint j = 0; j < currentUser.boxNum * 2; j++) {
                if(currentUser.boxIDs[j] == setWinningNumber){
                    winningUserID = currentUser.id;
                    winnerSponsorId = _users[winningUserID].sponsorId;
                    winnerSecondSponsorId = _users[winningUserID].secondSponsorId;
                    winnerSponsorAddress = _users[winnerSponsorId].address_;
                    winnerSecondSponsorAddress = _users[winnerSecondSponsorId].address_;
                }
            }
        }
        return winningUserID;
    }

    function getWinnderUserID() public view returns(uint){
        return winningUserID;
    }

    function payWinner(uint256 winnerPercentage, uint256 sponsorPercentage, uint256 secondSponsorPercentage) public payable {
        require(winnerPercentage + sponsorPercentage + secondSponsorPercentage <= 100, "Invalid Percentage.");
        uint winnerUserId = getWinnderUserID();
        address winnerAddress = _users[winnerUserId].address_;
        uint totalPrice = busdt.balanceOf(address(this)) - newUserAmount;
        uint winningPrice = totalPrice * winnerPercentage / 100;
        uint winningSponsorPrice = totalPrice * sponsorPercentage / 100;
        uint winnerSecondSponsorPrice = totalPrice * secondSponsorPercentage / 100;
        if(winnerSponsorId == 0 && winnerSecondSponsorId == 0){
            busdt.transfer(winnerAddress, winningPrice);
        } else if(winnerSecondSponsorId == 0){
            busdt.transfer(winnerAddress, winningPrice);
            busdt.transfer(winnerSponsorAddress, winningSponsorPrice);
        }else{
            busdt.transfer(winnerAddress, winningPrice);
            busdt.transfer(winnerSponsorAddress, winningSponsorPrice);
            busdt.transfer(winnerSecondSponsorAddress, winnerSecondSponsorPrice);           
        }
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
    function withdrawBUSDT() public onlyOwner {
        uint totalPrice = busdt.balanceOf(address(this)) - newUserAmount;
        busdt.transfer(msg.sender, totalPrice);
    }
    function reset() public{
        currentLotteryIdToBool[currentLotteryId] = true;
        pastLotterId = currentLotteryId;
    }
}
