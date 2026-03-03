import { describe, it, expectTypeOf } from "vitest";
import type { MonitoringTask, MonitoringSource, MonitoringEntity, MonitoringFilters } from "@/lib/types";

describe("MonitoringTask type", () => {
  it("has correct shape", () => {
    expectTypeOf<MonitoringTask>().toHaveProperty("title");
    expectTypeOf<MonitoringTask>().toHaveProperty("scope");
    expectTypeOf<MonitoringTask>().toHaveProperty("keywords");
    expectTypeOf<MonitoringTask>().toHaveProperty("entities");
    expectTypeOf<MonitoringTask>().toHaveProperty("sources");
    expectTypeOf<MonitoringTask>().toHaveProperty("frequency");
    expectTypeOf<MonitoringTask>().toHaveProperty("filters");
  });

  it("all fields are optional", () => {
    expectTypeOf<{}>().toMatchTypeOf<MonitoringTask>();
  });

  it("MonitoringSource has type and name", () => {
    expectTypeOf<MonitoringSource>().toHaveProperty("type");
    expectTypeOf<MonitoringSource>().toHaveProperty("name");
  });

  it("MonitoringEntity has type, name, optional description", () => {
    expectTypeOf<MonitoringEntity>().toHaveProperty("type");
    expectTypeOf<MonitoringEntity>().toHaveProperty("name");
    expectTypeOf<MonitoringEntity>().toHaveProperty("description");
  });

  it("MonitoringFilters has optional fields", () => {
    expectTypeOf<{}>().toMatchTypeOf<MonitoringFilters>();
  });
});
