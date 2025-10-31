import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { AppService } from "./app.service";
import { CalendarEntry } from "./models/CalendarEntry";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("calendar")
  getAll() {
    return this.appService.getAll();
  }

  @Get("calendar/:id")
  getOne(@Param("id") id: string) {
    return this.appService.getOne(id);
  }

  @Post("calendar")
  create(@Body() body: Partial<CalendarEntry>) {
    return this.appService.create(body);
  }

  @Put("calendar/:id")
  update(@Param("id") id: string, @Body() body: Partial<CalendarEntry>) {
    return this.appService.update(id, body);
  }

  @Delete("calendar/:id")
  remove(@Param("id") id: string) {
    this.appService.delete(id);
    return { ok: true };
  }

  @Post("api/pitches")
  createPitch(@Body() body: any) {
    return this.appService.createPitch(body);
  }

  @Post("drafts")
  createDraft(@Body() body: any) {
    return this.appService.createDraftEntry(body);
  }
}