using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.UI;

public class ConnectButton : MonoBehaviour
{
    public GameObject target;

    [DllImport("__Internal")]
    private static extern bool IsConnected(string targetName);

    [DllImport("__Internal")]
    private static extern void Connect(string targetName);

    [DllImport("__Internal")]
    private static extern void Disconnect(string targetName);

    public void OnClick()
    {
        if (!IsConnected(target.name))
        {
            Connect(target.name);
            GetComponentInChildren<Text>().text = "Disconnect";
        }
        else
        {
            Disconnect(target.name);
            GetComponentInChildren<Text>().text = "Connect";
        }
    }
}
