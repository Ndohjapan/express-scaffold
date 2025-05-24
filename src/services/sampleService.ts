import { BadRequestException } from "../errors/exceptions/badRequest";
import { AccountDBService, BusinessDBService, RouterDBService, SubscriptionPlanDBService, UserDBService, UserSubscriptionDBService, VoucherSubscriptionDBService } from "../database/dbService";

export class ClassesService {
  account: AccountDBService;
  business: BusinessDBService;
  router: RouterDBService;
  subscriptionplan: SubscriptionPlanDBService;
  users: UserDBService;
  usersubs: UserSubscriptionDBService;
  vouchers: VoucherSubscriptionDBService;
  constructor() {
    this.account = new AccountDBService()
    this.business = new BusinessDBService()
    this.router = new RouterDBService()
    this.subscriptionplan = new SubscriptionPlanDBService()
    this.users = new UserDBService()
    this.usersubs = new UserSubscriptionDBService()
    this.vouchers = new VoucherSubscriptionDBService()
  }


  async Testing() {
    try {
      const accounts = await this.account.findManyByFilter({});
      const business = this.business.findManyByFilter({});
      const routers = this.router.findManyByFilter({});
      const plans = this.subscriptionplan.findManyByFilter({});
      const users = this.users.findManyByFilter({});
      const subs = this.usersubs.findManyByFilter({});
      const vouchers = this.vouchers.findManyByFilter({});

      return { accounts, business, routers, plans, users, subs, vouchers }

    } catch (error) {
      throw new BadRequestException("Hello world", 400, error as Error)
    }
  }
}