# Unity WebGL + micro:bit でカーレース
以前にWheel Colliderを使ってみた[Drive](https://github.com/coderdojo-todakoen/Drive)プロジェクトの車を、Bluetoothで接続したmicro:bitで操作するようにしてみました。  
PCのブラウザで動作するように、WebGLでビルドし、JavaScriptでmicro:bitに接続します。  
さらに、2つのmicro:bitを使用すると、対戦(?)できるようにしてみました。  
スピードを出しすぎると、スリップしてコントロール不能なのは相変わらずです。Wheel Colliderの使い方で調整できるのでしょうか？  
  
Asset Storeの[Low Poly Road Pack](https://assetstore.unity.com/packages/3d/environments/roadways/low-poly-road-pack-67288)を使わせていただきました。
## 動作環境
### PCブラウザ
Web Bluetooth APIに対応したブラウザ(最新のChromeやEdgeなど)を使用してください。
### micro:bit
レポジトリのmicrobitフォルダにあるhexファイルを、micro:bitに書き込みます。
## 操作方法
- 「Connect」ボタンをクリックすると、hexファイルを書き込んだmicro:bitを選択するダイアログが表示されます。
- micro:bitを選択して接続できると、クリックしたボタン側の車をmicro:bitで操作できます。2台のmicro:bitを接続する場合は、それぞれのボタンをクリックしてmicro:bitを選択してください。
- Aボタンで加速、Bボタンで後退します。左右の傾きで左右にカーブします。
