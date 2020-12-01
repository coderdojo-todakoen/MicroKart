using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

[System.Serializable]
public class AxleInfo
{
    public WheelCollider leftWheel;
    public WheelCollider rightWheel;
    public bool motor;
    public bool steering;

    public Transform leftVisualWheel;
    public Transform rightVisualWheel;
}

// Unity Manualにある、「Wheel Collider Tutorial」を
// 使用した、WheelColliderのデモ
public class SimpleCarController : MonoBehaviour
{
    public List<AxleInfo> axleInfos;
    public float maxMotorTorque;
    public float maxSteeringAngle;

    private Rigidbody rb;

    public Text time;
    public Text speed;

    public Camera camera_;

    // Main Cameraの位置(車のローカル座標)
    private Vector3 cameraPosition = new Vector3(0, 1, -3.5F);

    // micro:bitのボタンの状態(0: なし、1: Aボタン、-1: Bボタン)
    private int buttonState = 0;
    // micro:bitの傾き(x軸方向の加速度計の値)
    private float tilt = 0;

    // 垂直方向の入力値(ボタンの状態)
    private float vertical = 0;
    // 水平方向の入力値(傾き)
    private float horizontal = 0;

    // 開始時の位置
    private Vector3 startPosition;
    // 開始時の向き
    private Quaternion startRotation;

    public void Start()
    {
        rb = GetComponent<Rigidbody>();
        // 車が転ばないように、重心を下げてみる
        rb.centerOfMass = new Vector3(0, -0.5F, 0);

        // Cameraを車の後ろへ移動し、車の方へ向けます
        camera_.transform.position = transform.TransformPoint(cameraPosition);
        camera_.transform.LookAt(transform);

        // 開始時の位置と向きを保存します
        startPosition = rb.position;
        startRotation = rb.rotation;
    }

    // 対応する視覚的なホイールを見つけます
    // Transform を正しく適用します
    public void ApplyLocalPositionToVisuals(WheelCollider collider, Transform visualWheel)
    {
        if (visualWheel == null)
        {
            return;
        }

        Vector3 position;
        Quaternion rotation;
        collider.GetWorldPose(out position, out rotation);

        visualWheel.transform.position = position;
        visualWheel.transform.rotation = rotation;
    }

    public void FixedUpdate()
    {
        vertical = Mathf.Lerp(vertical, buttonState, 0.8F);
        float motor = maxMotorTorque * vertical;
        horizontal = Mathf.Lerp(horizontal, tilt, 0.8F);
        float steering = maxSteeringAngle * horizontal;

        if (transform.position.y < -60)
        {
            // コースから外れたら開始位置へ戻します
            motor = 0;
            steering = 0;
            rb.position = startPosition;
            rb.rotation = startRotation;
            rb.velocity = Vector3.zero;
        }

        foreach (AxleInfo axleInfo in axleInfos)
        {
            if (axleInfo.steering)
            {
                axleInfo.leftWheel.steerAngle = steering;
                axleInfo.rightWheel.steerAngle = steering;
            }
            if (axleInfo.motor)
            {
                axleInfo.leftWheel.motorTorque = motor;
                axleInfo.rightWheel.motorTorque = motor;
            }
            ApplyLocalPositionToVisuals(axleInfo.leftWheel, axleInfo.leftVisualWheel);
            ApplyLocalPositionToVisuals(axleInfo.rightWheel, axleInfo.rightVisualWheel);
        }

        if (time != null)
        {
            // 経過時間を表示します
            float t = Time.fixedTime;
            int m = (int)(t / 60.0f);
            float s = t - m * 60.0f;
            time.text = String.Format("{0:00}.{1:00.00}", m, s);
        }

        // 速度を秒速(m/s)から時速(km/h)へ変換して表示します
        Vector3 v = rb.transform.InverseTransformDirection(rb.velocity);
        float z = v.z * 3.6f;
        speed.text = String.Format("{0:###0.00} km/h", z);

        // Cameraを車の後ろへ移動し、車の方へ向けます
        camera_.transform.position = Vector3.Lerp(camera_.transform.position,
                                                        transform.TransformPoint(cameraPosition),
                                                        0.2F);
        camera_.transform.LookAt(transform);
    }

    public void OnReset()
    {
        // [Reset]ボタンが押されたら、
        // シーンを再表示します
        SceneManager.LoadScene("Main");
    }

    // micro:bitの加速度計のx軸方向の値を受け取ります
    public void OnAccelerometerChanged(int x)
    {
        const float MAX_X = 1600F;
        tilt = Mathf.Clamp(x / MAX_X, -1, 1);
    }

    // micro:bitのAボタンの通知を受け取ります
    public void OnButtonAChanged(int state)
    {
        buttonState = (state == 0 ? 0 : 1);
    }

    // micro:bitのBボタンの通知を受け取ります
    public void OnButtonBChanged(int state)
    {
        buttonState = (state == 0 ? 0 : -1);
    }

    // micro:bitとの接続が切れた場合に呼び出されます
    public void OnDisconnected()
    {
        Debug.Log("OnDisconnected");
    }
}