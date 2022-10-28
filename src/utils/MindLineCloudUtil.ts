import axios, {AxiosInstance} from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
//import jsonp from 'axios-jsonp'
import jsonp from 'jsonp'
import md5 from 'md5';

export default class MindLineCloudUtil {
  private _axios!: AxiosInstance

  constructor() {
    this._axios = axios.create({
      baseURL: 'http://www.mindline.cn',
      headers: {
        'Refer': 'http://www.mindline.cn/webapp',
      }

    });

    this._axios.interceptors.request.use(req => {
      req.params = {_: Date.now(), ...req.params};
      req.headers!['vc'] = this.generateValueCheckStr();
      return req;
    })
  }

  private generateValueCheckStr() {
    const b = Date.now() / 1000;
    return md5('webapp' + b + '!!!');
  }

  public async login(account: string, pwd: string): Promise<boolean> {
    jsonp('',{headers:{}},()=>{})
    const resp = await this._axios.get('http://www.mindline.cn' + '/login',
      {
        params: {'telephone': account, 'vcode': pwd, 'passwordReset': 0},
      })
    console.log(resp)
    return false
  }
}
