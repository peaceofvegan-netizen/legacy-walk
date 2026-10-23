import ExpoModulesCore
import CoreMotion
import Foundation

// Core Motion's OS-managed history survives JavaScript suspension/termination.
// This module does not run a background timer and does not claim to keep an
// app alive after force quit. Reconciliation runs when the app next executes.
public final class LegathonMotionHistoryModule: Module {
  private let activityManager = CMMotionActivityManager()
  private let pedometer = CMPedometer()
  private let activityQueue: OperationQueue = {
    let queue = OperationQueue()
    queue.name = "net.legathonwalk.motion-history"
    queue.maxConcurrentOperationCount = 1
    return queue
  }()

  public func definition() -> ModuleDefinition {
    Name("LegathonMotionHistory")

    AsyncFunction("isAvailableAsync") { () -> Bool in
      CMMotionActivityManager.isActivityAvailable() && CMPedometer.isStepCountingAvailable()
    }

    AsyncFunction("getActivitiesAsync") { (startMs: Double, endMs: Double, promise: Promise) in
      guard startMs.isFinite, endMs.isFinite, startMs >= 0, endMs > startMs,
            endMs <= Date().timeIntervalSince1970 * 1000 + 1000 else {
        promise.reject("ERR_MOTION_INTERVAL", "Invalid motion-history interval")
        return
      }
      guard CMMotionActivityManager.isActivityAvailable() else {
        promise.reject("ERR_MOTION_UNAVAILABLE", "Activity recognition is unavailable")
        return
      }
      // Include the last state before start, so an ongoing walking/driving
      // interval isn't mistaken for an absence of activity changes.
      let earliest = max(0, Date().timeIntervalSince1970 - 7 * 86400 + 1)
      let queryStart = Date(timeIntervalSince1970: earliest)
      let queryEnd = Date(timeIntervalSince1970: endMs / 1000)
      self.activityManager.queryActivityStarting(from: queryStart, to: queryEnd, to: self.activityQueue) { activities, error in
        if let error = error {
          promise.reject("ERR_MOTION_HISTORY", error.localizedDescription)
          return
        }
        guard let activities = activities else {
          promise.reject("ERR_MOTION_HISTORY", "Activity history was not returned")
          return
        }
        let sorted = activities.sorted { $0.startDate < $1.startDate }
        let previous = sorted.last { $0.startDate.timeIntervalSince1970 * 1000 <= startMs }
        var selected: [CMMotionActivity] = []
        if let previous = previous { selected.append(previous) }
        selected.append(contentsOf: sorted.filter {
          let time = $0.startDate.timeIntervalSince1970 * 1000
          return time > startMs && time < endMs
        })
        let result: [[String: Any]] = selected.map { activity in
          ["at": activity.startDate.timeIntervalSince1970 * 1000,
           "walking": activity.walking, "running": activity.running,
           "automotive": activity.automotive, "cycling": activity.cycling,
           "stationary": activity.stationary, "unknown": activity.unknown,
           "confidence": Int(activity.confidence.rawValue)]
        }
        promise.resolve(result)
      }
    }

    AsyncFunction("getStepsAsync") { (startMs: Double, endMs: Double, promise: Promise) in
      guard startMs.isFinite, endMs.isFinite, startMs >= 0, endMs > startMs,
            endMs <= Date().timeIntervalSince1970 * 1000 + 1000 else {
        promise.reject("ERR_STEP_INTERVAL", "Invalid step-history interval")
        return
      }
      self.pedometer.queryPedometerData(from: Date(timeIntervalSince1970: startMs / 1000),
                                      to: Date(timeIntervalSince1970: endMs / 1000)) { data, error in
        if let error = error {
          promise.reject("ERR_STEP_HISTORY", error.localizedDescription)
        } else if let data = data {
          promise.resolve(data.numberOfSteps.intValue)
        } else {
          promise.reject("ERR_STEP_HISTORY", "Step history was not returned")
        }
      }
    }
  }
}
