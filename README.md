# Utopia
乌托邦 | Utopia | 京东 | 线报监控 | 并发  
欢迎投稿 mailto:lolkda@proton.me  
一款基于nodejs的高性能多线程京东执行线报工具   
A nodejs-based high-performance multi-thread 京东(JD.Com, Inc) shop activity executor  

**点点star，感谢！ 
Give some stars, thank you!** 

## 中文  
### 前言  
Leaf删库了，我的青春结束了  
很久没有查看邮箱，我发现里面有几个投稿，感谢投稿！    

### 教程   
简单说下破解思路：找有授权的朋友，改一下utopia.js中的auth()，令其将服务器响应输出并存储，然后投喂各种类型的线报（自然地，不要太明显）  
麦基服务器风控做的很敏感，所以不建议通其他方法去抓响应  
另外，库里这个版本的utopia.js可能已经被麦基发现并且做了特征，如果要抓响应请用麦基给的原版文件修改  
抓大量响应后再去重、手动做分类判断（比如无线/100/100v2/京耕/京云/hdb...）然后自建鉴权服务器即可完成破解  
上面auth_api文件夹下的json文件就是我抓到的响应，大概只能跑100和京耕系列活动（没有仔细测试过）  
我已经被麦基风控了，抓不到更多响应了，还请完成破解的朋友带带我，谢谢！  

## ENGLISH  
### Preface  
Leaf delete his repo, my youth life end  
It's a long time since I last check E-mail box, several projects founded, thanks submitting!  

### Tutorial  
Breifly cracking solution: Find a friend verified by @iMeagic. Modify the function auth() in utopia.js making it output and save the response from iMeagic's auth server, then feed the scripts with various shop activity urls (making it naturally, not too aggressive)  
@iMeagic makes his auth server strong risk control, so it's not advised to grab server response in other ways  
Besides, utopia.js in this repo may already be found by @iMeagic and identified by his auth server, so please modify on the original file provided by @iMeagic  
Grabing lots of responses, try to de-duplicate and classify those responses by activity types (like wuxian/100/v2_100/jinggeng/jingyun/hdb... series), then self-host your own auth server  
The json file of the `auth_api` folder in this repo is what I grabbed from the server, seems only able to run 100&jinggeng series activities (not tested carefully)  
However I'm now taken down by @iMeagic and could not get more responses, so please help me if your have finished the cracking, thank you!  

## 【UTOPIA】免责声明

欢迎使用[NAI_SCAN]（以下简称“SCAN”）。在使用本项目之前，请务必仔细阅读并理解以下免责声明。通过使用本项目，您表示同意接受以下条款和条件：

### 1. 无担保声明

本项目及其相关文档按“原样”提供，没有任何明示或暗示的担保，包括但不限于适销性、特定用途适用性和非侵权的暗示担保。作者不担保本项目的准确性、完整性、可靠性、适用性或及时性。

### 2. 使用风险

使用本项目存在风险，并且用户必须自行承担所有风险和责任。作者不对任何因使用本项目而造成的直接或间接损失负责，包括但不限于数据损失、利润损失、业务中断等。

### 3. 责任限制

在任何情况下，作者不对任何特殊、间接、偶然、直接或连带损害负责，无论是在合同诉讼、侵权行为或其他方面，即使作者已被告知此类损害的可能性。本免责声明将在法律允许的最大范围内生效。

### 4. 知识产权

本项目的所有权利（包括但不限于版权、商标和专利）均属于作者。未经作者明确授权，不得将该项目用于任何商业目的。未经许可，不得复制、修改、分发或以任何方式利用本项目。

### 5. 法律适用

本免责声明受当地法律的管辖，并在法律允许的最大范围内解释。任何对本免责声明的解释或执行将受到[适用法律的管辖地]的法律条款的约束。

### 6. 接受条款

通过使用本项目，即表示您接受并同意遵守本免责声明。如果您不同意这些条款，请不要使用本项目。

### 7. 其他条款

本免责声明构成了您与作者之间关于本项目的完整协议，并取代了所有先前或同时达成的口头或书面协议。作者保留根据需要随时修改本免责声明的权利。

## 【UTOPIA】Disclaimer

Welcome to [NAI_SCAN] (hereinafter referred to as "SCAN"). Please ensure that you have carefully read and understood the following disclaimer before using this project. By using this project, you indicate your acceptance of the following terms and conditions:

### 1. No Warranty Statement
This project and its related documentation are provided "as is" without any express or implied warranty, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. The authors do not warrant the accuracy, completeness, reliability, suitability, or timeliness of this project.

### 2. Use at Your Own Risk
There are risks associated with the use of this project, and users must assume all risks and responsibilities. The authors shall not be responsible for any direct or indirect losses caused by the use of this project, including but not limited to data loss, profit loss, business interruption, etc.

### 3. Limitation of Liability
In no event shall the authors be liable for any special, indirect, incidental, direct, or consequential damages, whether in contract, tort, or otherwise, even if the authors have been informed of the possibility of such damages. This disclaimer shall be effective to the maximum extent permitted by law.

### 4. Intellectual Property Rights
All rights to this project (including but not limited to copyrights, trademarks, and patents) belong to the authors. This project shall not be used for any commercial purpose without the explicit authorization of the authors. Without permission, this project shall not be copied, modified, distributed, or used in any way.

### 5. Applicable Law
This disclaimer is governed by local laws and interpreted to the fullest extent permitted by law. Any interpretation or enforcement of this disclaimer shall be subject to the legal provisions of [applicable jurisdiction].

### 6. Acceptance of Terms
By using this project, you indicate your acceptance of and agreement to abide by this disclaimer. If you do not agree with these terms, please do not use this project.

### 7. Other Terms
This disclaimer constitutes the entire agreement between you and the authors regarding this project and supersedes all prior or contemporaneous oral or written agreements. The authors reserve the right to modify this disclaimer at any time as needed.
